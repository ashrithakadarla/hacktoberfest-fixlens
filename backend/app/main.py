import os
import dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.routes.health import router as health_router
from app.routes.diagnose import router as diagnose_router
from app.routes.follow_up import router as follow_up_router

dotenv.load_dotenv()

app = FastAPI(
    title="FixLens API",
    description="Multimodal AI Troubleshooting Assistant powered by Gemma 4",
    version="1.0.0"
)

# CORS Configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(health_router, prefix="/api", tags=["Health"])
app.include_router(diagnose_router, prefix="/api", tags=["Diagnose"])
app.include_router(follow_up_router, prefix="/api", tags=["Follow-up"])

@app.get("/")
async def root():
    return {
        "app": "FixLens",
        "tagline": "Show it what's wrong.",
        "docs": "/docs",
        "health": "/api/health"
    }

if __name__ == "__main__":
    import uvicorn
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host=host, port=port, reload=True)
