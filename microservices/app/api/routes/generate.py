from fastapi import APIRouter, Security, Depends
from api.dependencies import check_key

router = APIRouter()


@router.post("/generate",
             dependencies=[Depends(check_key)]
             )
async def generate():
    print("User reached the secret endpoint")
    return "If you see this, your API key is valid!"
