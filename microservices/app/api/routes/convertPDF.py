from fastapi import APIRouter, Security, Depends, File, UploadFile, HTTPException, Body
from api.dependencies import check_key
from PyPDF2 import PdfReader
from io import BytesIO
import base64
from dotenv import load_dotenv
import os

router = APIRouter()

load_dotenv()
FILE_SIZE_LIMIT = int(os.getenv('FILE_SIZE_LIMIT', 2 * 1024 * 1024))


async def extract_text_from_pdf(content: bytes) -> str:
    try:
        reader = PdfReader(BytesIO(content))
        text = ''
        for page in reader.pages:
            text += page.extract_text() + '\n'
        return text.strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to extract text from PDF: {str(e)}")


async def process_upload_file(pdf_file: UploadFile):
    content = await pdf_file.read()
    if len(content) > FILE_SIZE_LIMIT:
        raise HTTPException(status_code=413, detail="File exceeds size limit.")
    return await extract_text_from_pdf(content)


async def process_base64_content(base64_content: str):
    content = base64.b64decode(base64_content)
    if len(content) > FILE_SIZE_LIMIT:
        raise HTTPException(status_code=413, detail="File exceeds size limit.")
    return await extract_text_from_pdf(content)


@router.post("/convertPDF",
             dependencies=[Depends(check_key)]
             )
async def convert(
        pdf_file: UploadFile = File(None),
        base64_content: str = Body(None, embed=True)
):
    print("User reached the convertPDF endpoint")
    if pdf_file and pdf_file.content_type == 'application/pdf':
        print("Processing PDF file")
        text = await process_upload_file(pdf_file)
    elif base64_content:
        print("Processing Base64 content")
        text = await process_base64_content(base64_content)
    else:
        raise HTTPException(status_code=400, detail="No valid file found!")

    if text:
        return {"text": text}
    else:
        raise HTTPException(status_code=500, detail="Failed to extract text from PDF.")
