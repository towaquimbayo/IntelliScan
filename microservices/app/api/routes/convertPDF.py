from fastapi import APIRouter, Security, Depends, File, UploadFile
from api.dependencies import check_key

router = APIRouter()


@router.post("/convertPDF",
             dependencies=[Depends(check_key)]
             )
async def convert():

    return "Lorem Ipsum PDF Text"
