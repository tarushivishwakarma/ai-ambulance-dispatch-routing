from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import analysis

app = FastAPI(title="AI Ambulance Intelligence Service")

# Allow requests from the Node.js backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analysis.router, prefix="/api/ai", tags=["analysis"])

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "ai-intelligence"}

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
