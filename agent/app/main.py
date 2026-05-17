import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api.v1.router import router as v1_router


# =========================
# Logging
# =========================

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)

logger = logging.getLogger(__name__)


# =========================
# App Lifecycle
# =========================

@asynccontextmanager
async def lifespan(app: FastAPI):

    logger.info("Starting AI Agent Server...")

    yield

    logger.info("Shutting down AI Agent Server...")


# =========================
# FastAPI App
# =========================

app = FastAPI(
    title="AI Agent Server",
    description="Marketing Content Agent API",
    version="0.1.0",
    lifespan=lifespan,
)

app.include_router(v1_router)

# =========================
# Health Check
# =========================

@app.get("/")
async def root():
    return {
        "message": "AI Agent Server Running"
    }


@app.get("/health")
async def health_check():
    return {
        "status": "ok"
    }