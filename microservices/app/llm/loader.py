from contextlib import asynccontextmanager
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
import gc
import os
from dotenv import load_dotenv
from asyncio import Semaphore, Queue

load_dotenv()
model_id = os.getenv("MODEL_PATH")
max_pending_requests = int(os.getenv("MAX_PENDING_REQUESTS"))
max_concurrent_requests = int(os.getenv("MAX_CONCURRENT_REQUESTS"))


def load_model(model_path):
    if torch.cuda.is_available():
        device = "cuda"
    else:
        device = "cpu"

    print("Device: " + device)

    if device == "cuda":
        quantization_config = BitsAndBytesConfig(load_in_4bit=True)
        model = AutoModelForCausalLM.from_pretrained(model_path,
                                                     torch_dtype=torch.bfloat16 if torch.cuda.is_available() else torch.float32,
                                                     device_map="auto",
                                                     quantization_config=quantization_config,
                                                     attn_implementation="flash_attention_2")
    else:
        model = AutoModelForCausalLM.from_pretrained(model_path)
    model.eval()
    tokenizer = AutoTokenizer.from_pretrained(model_path, use_fast=True, model_max_length=2048)
    return model, tokenizer


@asynccontextmanager
async def model_lifespan(app):
    model, tokenizer = load_model(model_id)
    app.state.model = model
    app.state.tokenizer = tokenizer
    app.state.semaphore = Semaphore(max_concurrent_requests)
    app.state.request_queue = Queue(max_pending_requests)
    try:
        yield
    finally:
        del model
        del tokenizer
        app.state.model = None
        app.state.tokenizer = None
        del app.state.semaphore
        del app.state.queue
        gc.collect()
        torch.cuda.empty_cache()
