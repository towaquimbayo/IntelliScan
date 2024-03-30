from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def get_default():
    return "If you see this, the API is Running!"
