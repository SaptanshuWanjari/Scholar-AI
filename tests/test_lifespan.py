import asyncio
from fastapi import FastAPI
from scholarai.api.app import lifespan

async def test():
    app = FastAPI()
    async with lifespan(app):
        print("Lifespan started")
        await asyncio.sleep(2)
        print("Lifespan ending")

if __name__ == "__main__":
    asyncio.run(test())
