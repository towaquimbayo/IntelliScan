from contextlib import asynccontextmanager
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig, TextIteratorStreamer
import gc
import os
from dotenv import load_dotenv

load_dotenv()
model_id = os.getenv("MODEL_PATH")


def load_model(model_path):
    if torch.cuda.is_available():
        device = "cuda"
    else:
        device = "cpu"

    print("Device: " + device)
    quantization_config = BitsAndBytesConfig(load_in_4bit=True)
    model = AutoModelForCausalLM.from_pretrained(model_path,
                                                 torch_dtype=torch.bfloat16 if torch.cuda.is_available() else torch.float32,
                                                 device_map="auto",
                                                 quantization_config=quantization_config,
                                                 attn_implementation="flash_attention_2")
    tokenizer = AutoTokenizer.from_pretrained(model_path)
    return model, tokenizer


@asynccontextmanager
async def model_lifespan(app):
    model, tokenizer = load_model(model_id)
    app.state.model = model
    app.state.tokenizer = tokenizer
    try:
        yield
    finally:
        del model
        del tokenizer
        app.state.model = None
        app.state.tokenizer = None
        gc.collect()
        torch.cuda.empty_cache()
