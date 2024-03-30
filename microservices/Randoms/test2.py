import time
import gc

start_time = time.time()
embedding_time = time.time()
print("Embedding time: " + str(round(embedding_time - start_time, 3)) + " seconds")

import torch

from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig

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

model_load_time = time.time()
gc.collect()
torch.cuda.empty_cache()
print("Model load time: " + str(round(model_load_time - embedding_time, 3)) + " seconds")

messages = [
    {"role": "user", "content": "What is your favourite condiment?"},
    {"role": "assistant",
     "content": "Well, I'm quite partial to a good squeeze of fresh lemon juice. It adds just the right amount of zesty flavour to whatever I'm cooking up in the kitchen!"},
    {"role": "user", "content": "Do you have mayonnaise recipes?"}
]

# print("\n\n***Sending messages: " + str(messages))
encodeds = tokenizer.apply_chat_template(messages, return_tensors="pt")

model_inputs = encodeds.to(device)
# model.to(device)

generated_ids = model.generate(model_inputs, max_new_tokens=2048, do_sample=True)

decoded = tokenizer.batch_decode(generated_ids[:, model_inputs.shape[1]:], skip_special_tokens=True)[0]
print(decoded)
gc.collect()
torch.cuda.empty_cache()

gen1_time = time.time()
# print("\n\n***Data received generated ids: " + str(generated_ids))
# print("\n\n***Data received decoded: " + str(decoded))
print("LLM generate time: " + str(round(gen1_time - model_load_time, 3)) + " seconds")

messages = [
    {"role": "user", "content": "What is your favourite condiment?"},
    {"role": "assistant", "content": "Well, I'm quite partial to a good squeeze of fresh lemon juice."},
    {"role": "user", "content": "Do you have lemon recipes?"}
]

encodeds = tokenizer.apply_chat_template(messages, return_tensors="pt")

model_inputs = encodeds.to(device)
# model.to(device)

generated_ids = model.generate(model_inputs, max_new_tokens=2048, do_sample=True)
decoded = tokenizer.batch_decode(generated_ids[:, model_inputs.shape[1]:], skip_special_tokens=True)[0]
print(decoded)
gc.collect()
torch.cuda.empty_cache()

gen2_time = time.time()
# print("\n\n***Data received generated ids: " + str(generated_ids))
# print("\n\n***Data received decoded: " + str(decoded))
print("LLM generate time: " + str(round(gen2_time - gen1_time, 3)) + " seconds")

total_time = time.time()
print("Total time: " + str(round(total_time - start_time, 3)) + " seconds")

del model
gc.collect()
torch.cuda.empty_cache()