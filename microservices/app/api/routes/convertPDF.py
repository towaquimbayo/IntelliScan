from fastapi import APIRouter, Security, Depends, File, UploadFile, HTTPException
from api.dependencies import check_key
from PyPDF2 import PdfReader
from io import BytesIO

router = APIRouter()


@router.post("/convertPDF",
             dependencies=[Depends(check_key)]
             )
async def convert(pdf_file: UploadFile = File(...)):
    if pdf_file.content_type != 'application/pdf':
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a PDF file.")

    # Read file content into memory
    content = await pdf_file.read()

    # Check file size (set limit to 5MB)
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File size exceeds limit of 5MB.")

    try:
        # Convert PDF to text using an in-memory buffer
        reader = PdfReader(BytesIO(content))
        text = ''
        for page in reader.pages:
            text += page.extract_text() + '\n'

        return {"text": text.strip()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
