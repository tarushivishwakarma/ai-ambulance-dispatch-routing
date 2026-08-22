import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
if API_KEY and API_KEY != "placeholder_key_change_me_later":
    genai.configure(api_key=API_KEY)
    
# Initialize the model (using gemini-pro for text and gemini-pro-vision if images were supported directly, but standard gemini-1.5-pro supports both)
try:
    model = genai.GenerativeModel('gemini-1.5-pro-latest')
except:
    model = None

async def analyze_incident(description: str, category: str, image_path: str = None) -> dict:
    """
    Analyzes an incident and returns structured JSON with severity, category, and medical flags.
    """
    if not model or not API_KEY or API_KEY == "placeholder_key_change_me_later":
        # Fallback to simulated response for development when key is missing
        return simulate_analysis(description, category)

    prompt = f"""
    You are an AI emergency dispatch assistant. Analyze the following incident report:
    Category: {category}
    Description: {description}
    
    Output your response STRICTLY as a JSON object with the following schema:
    {{
        "verified": boolean,
        "recommendedCategory": string,
        "recommendedSeverity": integer (0-10),
        "confidenceScore": float (0.0-1.0),
        "medicalEmergency": boolean,
        "possibleCasualties": integer,
        "reasoning": string
    }}
    """
    
    try:
        response = model.generate_content(prompt)
        import json
        # Strip markdown json blocks if present
        text = response.text.replace('```json', '').replace('```', '').strip()
        return json.loads(text)
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return simulate_analysis(description, category)

def simulate_analysis(description: str, category: str) -> dict:
    """Mock analysis for development without API keys"""
    desc_lower = description.lower() if description else ""
    
    is_medical = "heart" in desc_lower or "bleed" in desc_lower or category == "MEDICAL_EMERGENCY"
    severity = 5
    if "fire" in desc_lower or "crash" in desc_lower: severity = 8
    if "unconscious" in desc_lower or "not breathing" in desc_lower: severity = 10
    
    return {
        "verified": True,
        "recommendedCategory": category,
        "recommendedSeverity": severity,
        "confidenceScore": 0.85,
        "medicalEmergency": is_medical,
        "possibleCasualties": 1 if is_medical else 0,
        "reasoning": "Simulated AI analysis based on keywords due to missing API key."
    }
