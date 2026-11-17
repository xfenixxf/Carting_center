from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import ALL_ROUTERS

app = FastAPI(title="Karting Center API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

for r in ALL_ROUTERS:
    app.include_router(r)

@app.get("/api/health")
def health(): return {"status": "ok"}