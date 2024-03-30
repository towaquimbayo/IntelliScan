from fastapi import APIRouter, Security, Depends
from api.dependencies import check_key

router = APIRouter()


@router.get("/secret",
            dependencies=[Depends(check_key)]
            )
async def get_testapi():
    return "If you see this, your API key is valid!"
