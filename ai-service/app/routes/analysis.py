from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.gemini_service import analyze_incident

router = APIRouter()

class IncidentRequest(BaseModel):
    incidentId: str
    description: str
    category: str
    imagePath: Optional[str] = None

@router.post("/analyze")
async def process_incident(request: IncidentRequest):
    try:
        analysis_result = await analyze_incident(
            description=request.description,
            category=request.category,
            image_path=request.imagePath
        )
        return {"success": True, "data": analysis_result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
