import time
start_time = time.time()

from sentence_transformers import SentenceTransformer
sentences = ["This is an example sentence", "Each sentence is converted"]

model = SentenceTransformer('./all-mpnet-base-v2')
embeddings = model.encode(sentences)
print(embeddings)
hf = embeddings

embedding_time = time.time()
print("Embedding time: " + str(round(embedding_time - start_time, 3)) + " seconds")


import torch
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
from sentence_transformers import SentenceTransformer
import faiss
# import streamlit as st
# Assuming other necessary imports are done as per your original script

from transformers import AutoModelForCausalLM, AutoTokenizer

# device = "cuda" # the device to load the model onto
if torch.cuda.is_available():
    device = "cuda"
else:
    device = "cpu"

print("Device: " + device)

model = AutoModelForCausalLM.from_pretrained("./Mistral-7B-Instruct-v0.2")
tokenizer = AutoTokenizer.from_pretrained("./Mistral-7B-Instruct-v0.2")

model_load_time = time.time()
print("Model load time: " + str(round(model_load_time - embedding_time, 3)) + " seconds")

messages = [
    {"role": "user", "content": "What is your favourite condiment?"},
    {"role": "assistant", "content": "Well, I'm quite partial to a good squeeze of fresh lemon juice. It adds just the right amount of zesty flavour to whatever I'm cooking up in the kitchen!"},
    {"role": "user", "content": "Do you have lemon recipes?"}
]

encodeds = tokenizer.apply_chat_template(messages, return_tensors="pt")

model_inputs = encodeds.to(device)
model.to(device)

generated_ids = model.generate(model_inputs, max_new_tokens=1000, do_sample=True)
decoded = tokenizer.batch_decode(generated_ids)
print(decoded[0])

end_time = time.time()
print("LLM generate time: " + str(round(end_time - model_load_time, 3)) + " seconds")

total_time = time.time()
print("Total time: " + str(round(total_time - start_time, 3)) + " seconds")
