import re
import time
import gc
from threading import Thread

from pypdf import PdfReader

start_time = time.time()


def read_pdf_and_extract_text(pdf_path):
    text = ''
    reader = PdfReader(pdf_path)
    for page in reader.pages:
        text += page.extract_text() + '\n'
    return re.sub(' +', ' ', text)


pdf_path = './testDoc.pdf'
pdf_text = read_pdf_and_extract_text(pdf_path)
print("PDF text length:", len(pdf_text))
short_pdf_text = pdf_text[:5000]
pdf_text = short_pdf_text
pdf_time = time.time()
print("PDF read time: " + str(round(pdf_time - start_time, 3)) + " seconds")

import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig, TextIteratorStreamer

# device = "cuda" # the device to load the model onto
if torch.cuda.is_available():
    device = "cuda"
else:
    device = "cpu"

print("Device: " + device)
quantization_config = BitsAndBytesConfig(load_in_4bit=True)
model = AutoModelForCausalLM.from_pretrained("../accelerated-gemma-2b-it",
                                             torch_dtype=torch.bfloat16 if torch.cuda.is_available() else torch.float32,
                                             device_map="auto",
                                             quantization_config=quantization_config,
                                             attn_implementation="flash_attention_2")
tokenizer = AutoTokenizer.from_pretrained("../accelerated-gemma-2b-it")
model.eval()

model_load_time = time.time()
gc.collect()
torch.cuda.empty_cache()
print("Model load time: " + str(round(model_load_time - pdf_time, 3)) + " seconds")

pre_query = "Hi, I have a question about a PDF document. Can you help me?"
pre_prompt = "Hello I am Intelliscan. \
I (Intelliscan) helps answer questions about a PDF document. \
I help answer questions about a PDF document. \
Ask your question and I will do my best to help you!"
user_question = "What is the document about?"
# chat_history = [
#     {"role": "user", "content": pre_query},
#     {"role": "assistant", "content": pre_prompt},
#     {"role": "user", "content": ("Use the following pieces of context to answer the question at the end. \
#     If answer is not clear, say I DONT KNOW." + pdf_text + " Question: " + user_question)},
# ]
chat_history = [
    {"role": "user", "content": pre_query},
    {"role": "assistant", "content": pre_prompt},
    {"role": "user", "content": "Hi, what is you name and what do you do?"},
]
text_streamer = TextIteratorStreamer(tokenizer, skip_prompt=True, skip_special_tokens=True)
encodeds = tokenizer.apply_chat_template(chat_history, return_tensors="pt")
model_inputs = encodeds.to(device)

generation_kwargs = {
    "input_ids": model_inputs,
    "streamer": text_streamer,
    "pad_token_id": tokenizer.pad_token_id,
    "eos_token_id": tokenizer.eos_token_id,
    "max_new_tokens": 2048,
    "penalty_alpha": 0.6,
    "repetition_penalty": 1.0,
    "temperature": 0.1,
    "top_k": 40,
    "top_p": 1.0,
    "do_sample": True,
    "num_beams": 1,
}

thread = Thread(target=model.generate, kwargs=generation_kwargs)
thread.start()

for word in text_streamer:
    print(word, end="")

gc.collect()
torch.cuda.empty_cache()

gen1_time = time.time()
print("\nLLM generate time: " + str(round(gen1_time - model_load_time, 3)) + " seconds")

total_time = time.time()
print("Total time: " + str(round(total_time - start_time, 3)) + " seconds")
