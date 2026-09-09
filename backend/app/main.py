import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database.database import Base, engine
from app.api import api_router
from app.models.translation import HealthResponse

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("translator_app")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for database initialization."""
    logger.info("Initializing database tables...")
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables initialized successfully.")
    except Exception as e:
        logger.error(f"Failed to initialize database: {str(e)}")
    yield
    logger.info("Application shutting down.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AI-Powered Multilingual Universal Translator with Voice and Text Translation API",
    lifespan=lifespan
)

# Configure CORS
origins = settings.cors_origins_list
if not origins or "*" in origins or settings.ENVIRONMENT == "development":
    origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health endpoint
@app.get("/api/health", response_model=HealthResponse, tags=["Health"])
def health_check():
    db_type = "PostgreSQL" if "postgres" in settings.DATABASE_URL.lower() else "SQLite"
    return HealthResponse(
        status="healthy",
        version=settings.VERSION,
        provider=settings.TRANSLATION_PROVIDER,
        database=db_type
    )

# Include core API routes
app.include_router(api_router)

@app.get("/", tags=["Root"])
def root():
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
        "health": "/api/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=True)
