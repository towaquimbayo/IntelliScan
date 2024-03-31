import asyncio
import json
from fastapi import HTTPException, status, Security, Request
from fastapi.security import APIKeyHeader, APIKeyQuery
from dotenv import load_dotenv
import os

load_dotenv()
API_KEYS = json.loads(os.getenv("API_KEYS"))

api_key_query = APIKeyQuery(name="api-key", auto_error=False)
api_key_header = APIKeyHeader(name="x-api-key", auto_error=False)


def check_key(
        api_key_query: str = Security(api_key_query),
        api_key_header: str = Security(api_key_header),
) -> str:
    """Retrieve and validate an API key from the query parameters or HTTP header.

    Args:
        api_key_query: The API key passed as a query parameter.
        api_key_header: The API key passed in the HTTP header.

    Returns:
        The validated API key.

    Raises:
        HTTPException: If the API key is invalid or missing.
    """
    if api_key_query in API_KEYS:
        return api_key_query
    if api_key_header in API_KEYS:
        return api_key_header
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or missing API Key",
    )


async def check_request_queue(request: Request):
    if request.app.state.semaphore.locked():
        if request.app.state.request_queue.qsize() >= request.app.state.request_queue.maxsize:
            print("Too many requests, rejecting")
            print("Queue size: " + str(request.app.state.request_queue.qsize()))
            print("Max size: " + str(request.app.state.request_queue.maxsize))
            raise HTTPException(status_code=429, detail="Too many requests, please try again later.")
        await request.app.state.request_queue.put(request)
        print("Busy added request to queue")
        print("Queue size: " + str(request.app.state.request_queue.qsize()))
        print("Max size: " + str(request.app.state.request_queue.maxsize))
        try:
            await request.app.state.semaphore.acquire()
            yield
        finally:
            request.app.state.semaphore.release()
            await request.app.state.request_queue.get()
            request.app.state.request_queue.task_done()
    else:
        await request.app.state.semaphore.acquire()
        try:
            yield
        finally:
            request.app.state.semaphore.release()
