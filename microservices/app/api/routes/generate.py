from fastapi import APIRouter, Depends, Request, HTTPException
from pydantic import BaseModel
from api.dependencies import check_key, check_request_queue
from transformers import TextIteratorStreamer
import torch
import asyncio
import re


router = APIRouter()

pre_query = "Hi, I have a question about a PDF document. Can you help me?"
pre_prompt = "Hello I am Intelliscan. \
I (Intelliscan) helps answer questions about a PDF document. \
I (Intelliscan) help answer questions about a PDF document. \
I (Intelliscan) does not remember what was said previously \
Ask your question and I will do my best to help you!"


class GenerationParameters(BaseModel):
    prompt: str
    context: str = None


def clean_text(text):
    # Remove non-ASCII characters
    text = re.sub(r'[^\x00-\x7F]+', ' ', text)
    # Replace multiple spaces with a single space
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def generate_response(request: Request, input_data: GenerationParameters):
    model = request.app.state.model
    tokenizer = request.app.state.tokenizer
    if not model or not tokenizer:
        raise HTTPException(status_code=503, detail="Model not loaded")

    prompt = input_data.prompt
    context = input_data.context

    if prompt is None:
        raise HTTPException(status_code=400, detail="Missing prompt")

    prompt = clean_text(input_data.prompt)[:2048]
    context = clean_text(input_data.context)[:4096] if input_data.context else None

    if context is None:
        chat_history = [
            {"role": "user", "content": pre_query},
            {"role": "assistant", "content": pre_prompt},
            {"role": "user", "content": prompt},
        ]
    else:
        chat_history = [
            {"role": "user", "content": pre_query},
            {"role": "assistant", "content": pre_prompt},
            {"role": "user", "content": ("Use the following pieces of context to answer the question at the end. \
            If answer is not clear, say I DONT KNOW. Context: " + context + " Question: " + prompt)},
        ]

    device = "cuda" if torch.cuda.is_available() else "cpu"
    text_streamer = TextIteratorStreamer(tokenizer, skip_prompt=True, skip_special_tokens=True)
    encodeds = tokenizer.apply_chat_template(chat_history, return_tensors="pt")
    model_inputs = encodeds.to(device)

    generation_kwargs = {
        "input_ids": model_inputs,
        "streamer": text_streamer,
        "pad_token_id": tokenizer.pad_token_id,
        "eos_token_id": tokenizer.eos_token_id,
        "max_new_tokens": 512,
        "penalty_alpha": 0.6,
        "repetition_penalty": 1.0,
        "temperature": 0.1,
        "top_k": 40,
        "top_p": 1.0,
        "do_sample": True,
        "use_cache": True,
        "num_beams": 1,
    }

    generated_ids = model.generate(**generation_kwargs)
    response_text = tokenizer.batch_decode(generated_ids[:, model_inputs.shape[1]:], skip_special_tokens=True)[0]
    # print(response_text)

    return response_text


@router.post(
    "/generate",
    dependencies=[
        Depends(check_key),
        Depends(check_request_queue)]
)
async def generate(
        request: Request,
        input_data: GenerationParameters
):
    response_text = await asyncio.to_thread(generate_response, request, input_data)
    return {"response": response_text}
