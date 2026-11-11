from fastapi import FastAPI

from realapp_tools.card_upgrade import router

app = FastAPI(title="Real App Tools")
app.include_router(router, prefix="/api/v1")
