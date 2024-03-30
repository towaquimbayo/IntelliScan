import time
import gc
import fitz
import torch

from transformers import pipeline, Conversation, BitsAndBytesConfig, AutoModelForCausalLM, AutoTokenizer

start_time = time.time()


def read_pdf_and_extract_text(pdf_path):
    text = ''
    with fitz.open(pdf_path) as doc:
        for page in doc:
            text += page.get_text()
    return text


pdf_path = './testDoc.pdf'
pdf_text = read_pdf_and_extract_text(pdf_path)

pdf_read_time = time.time()
print("PDF read time:", round(pdf_read_time - start_time, 2), "seconds")

quantization_config = BitsAndBytesConfig(load_in_4bit=True)
model = AutoModelForCausalLM.from_pretrained("../accelerated-gemma-2b-it",
                                             torch_dtype=torch.bfloat16 if torch.cuda.is_available() else torch.float32,
                                             device_map="auto",
                                             quantization_config=quantization_config,
                                             attn_implementation="flash_attention_2")
tokenizer = AutoTokenizer.from_pretrained("../accelerated-gemma-2b-it")

conversational_pipeline = pipeline("conversational",
                                   model=model,
                                   tokenizer=tokenizer,)
model.eval()

model_load_time = time.time()
print("Model load time:", round(model_load_time - pdf_read_time, 2), "seconds")

# Prepare the initial conversation setup
pre_query = "Hi, I have a question about a PDF document. Can you help me?"
pre_prompt = "Hello, I am Intelliscan. \
I help answer questions about a PDF document. \
Ask your question, and I will do my best to help you!"
user_question = "What is the main idea of the document?"
pdf_context = "Here's the context from the document: " + pdf_text

# Start the conversation
conversation = Conversation(pre_query + " " + pre_prompt + " " + user_question + " " + pdf_context)
conversational_pipeline([conversation])

# Print the initial response
print(conversation.generated_responses[-1])
print("\n\t\t***************\n")

# Suppose you want to continue the conversation with a new question
follow_up_question = "Who wrote this document?"
conversation.add_user_input(follow_up_question)

conversational_pipeline([conversation])

# Print the follow-up response
print(conversation.generated_responses[-1])
print("\n\t\t***************\n")


# Suppose you want to continue the conversation with a new question
follow_up_question = "What COMP course is this document for?"
conversation.add_user_input(follow_up_question)

conversational_pipeline([conversation])

# Print the follow-up response
print(conversation.generated_responses[-1])
print("\n\t\t***************\n")


# Suppose you want to continue the conversation with a new question
follow_up_question = "What was this document about again?"

conversational_pipeline([conversation])

# Print the follow-up response
print(conversation.generated_responses[-1])
print("\n\t\t***************\n")

# Cleanup and timing
gc.collect()
torch.cuda.empty_cache()

generate_time = time.time()
print("Generation time:", round(generate_time - model_load_time, 2), "seconds")

total_time = time.time()
print("Total processing time:", round(total_time - start_time, 2), "seconds")
