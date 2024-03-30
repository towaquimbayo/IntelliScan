from fastapi import APIRouter

from .routes import home, convertPDF, secret, generate

api_router = APIRouter()
api_router.include_router(home.router, tags=["home"])
api_router.include_router(secret.router, tags=["secret"])
api_router.include_router(convertPDF.router, tags=["convertPDF"])
api_router.include_router(generate.router, tags=["generate"])
