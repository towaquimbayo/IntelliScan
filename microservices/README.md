
Models from:
https://huggingface.co/google/gemma-2b-it


To run test.py download the required models with (ensure you have git-lfs installed):
``` git clone https://huggingface.co/google/gemma-2b-it ```
Have at least 30GB of free space to download. You can delete the .git folder after downloading to save space.

To create a pre quantized model run:
``` create accelerated.py ```

To run the app cd into the app directory and run:

``` uvicorn main:app --reload ```
or with gunicorn:
``` gunicorn main:app -w 2 -k uvicorn.workers.UvicornWorker ```

