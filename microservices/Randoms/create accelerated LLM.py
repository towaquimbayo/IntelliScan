from transformers import AutoModelForCausalLM, BitsAndBytesConfig, AutoTokenizer
import torch


def accelerate(model_name, save):
    # Load and configure the model as before
    quantization_config = BitsAndBytesConfig(load_in_4bit=True)
    model = AutoModelForCausalLM.from_pretrained(model_name,
                                                 torch_dtype=torch.bfloat16,
                                                 device_map="auto",
                                                 quantization_config=quantization_config,
                                                 attn_implementation="flash_attention_2")

    tokenizer = AutoTokenizer.from_pretrained(model_name)

    model.save_pretrained(save)
    tokenizer.save_pretrained(save)


modelName = "../gemma-2b-it"
save = "../accelerated-gemma-2b-it"

accelerate(modelName, save)
