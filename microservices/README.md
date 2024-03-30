
Models from:

[//]: # (https://huggingface.co/sentence-transformers/all-mpnet-base-v2)

[//]: # (https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.2)
https://huggingface.co/google/gemma-2b-it


To run test.py download the required models with (ensure you have git-lfs installed):

[//]: # (git clone https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.2)

[//]: # (git clone https://huggingface.co/sentence-transformers/all-mpnet-base-v2)
``` git clone https://huggingface.co/google/gemma-2b-it ```
Have at least 30GB of free space to download. You can delete the .git folder after downloading to save space.



To run the app cd into the app directory and run:

``` uvicorn main:app --reload ```
