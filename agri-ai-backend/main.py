from google import genai
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, Form
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import datetime
import os
import uuid
import json
from PIL import Image
import io
import random
import math

# 1. Client Setup
API_KEY = "AIzaSyClMeZCwiQhtwLQ0_UGBuIcV9dxKpxfud4"
client = genai.Client(api_key=API_KEY)

# 2. Database Setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./agri_ai.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class DiagnosticHistory(Base):
    __tablename__ = "diagnostic_history"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    image_filename = Column(String)
    result = Column(JSON)

class UserSettings(Base):
    __tablename__ = "user_settings"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String)
    state = Column(String)
    primary_crop = Column(String)
    farm_size = Column(Integer) # in acres
    language = Column(String, default="en")
    notifications_enabled = Column(JSON, default={"sms": True, "email": True, "app": True})
    theme = Column(String, default="light")

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class MockResponse:
    def __init__(self, text):
        self.text = text

def generate_content_with_fallback(contents_payload):
    try:
        return client.models.generate_content(
            model="gemini-2.5-flash",
            contents=contents_payload
        )
    except Exception as e:
        err_msg = str(e).upper()
        if "503" in err_msg or "UNAVAILABLE" in err_msg or "429" in err_msg or "QUOTA" in err_msg:
            return MockResponse("The Google AI API is extremely busy (503/Quota Limit). This is temporary. Please try again in a few minutes! (Google AI API अभी अत्यधिक व्यस्त है। कृपया कुछ मिनटों में पुनः प्रयास करें!)")
        return MockResponse(f"API Connection Error: {str(e)}")

# 3. FastAPI App Initialization
app = FastAPI()

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Uploads
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# 4. Market Intelligence Mock Data
MANDIS = [
    {"id": 1, "name": "Azadpur Mandi", "city": "Delhi", "state": "Delhi", "lat": 28.7157, "lon": 77.1764},
    {"id": 2, "name": "Vashi Mandi", "city": "Mumbai", "state": "Maharashtra", "lat": 19.0375, "lon": 73.0035},
    {"id": 3, "name": "Koyambedu Market", "city": "Chennai", "state": "Tamil Nadu", "lat": 13.0732, "lon": 80.1912},
    {"id": 4, "name": "Kalyanpur Mandi", "city": "Kanpur", "state": "Uttar Pradesh", "lat": 26.4912, "lon": 80.2584},
    {"id": 5, "name": "Sahibabad Mandi", "city": "Ghaziabad", "state": "Uttar Pradesh", "lat": 28.6674, "lon": 77.3491},
    {"id": 6, "name": "Yeshwanthpur Mandi", "city": "Bengaluru", "state": "Karnataka", "lat": 13.0235, "lon": 77.5562},
    {"id": 7, "name": "Keshopur Mandi", "city": "Delhi", "state": "Delhi", "lat": 28.6412, "lon": 77.0864},
    {"id": 8, "name": "Ghazipur Mandi", "city": "Delhi", "state": "Delhi", "lat": 28.6256, "lon": 77.3256},
    {"id": 9, "name": "Lasalgaon Mandi", "city": "Nashik", "state": "Maharashtra", "lat": 20.1465, "lon": 74.2256},
    {"id": 10, "name": "Unjha Mandi", "city": "Unjha", "state": "Gujarat", "lat": 23.8124, "lon": 72.3912},
    {"id": 11, "name": "Khanna Mandi", "city": "Khanna", "state": "Punjab", "lat": 30.7072, "lon": 76.2162},
    {"id": 12, "name": "Neemuch Mandi", "city": "Neemuch", "state": "Madhya Pradesh", "lat": 24.4762, "lon": 74.8762},
    {"id": 13, "name": "Guntur Market", "city": "Guntur", "state": "Andhra Pradesh", "lat": 16.3067, "lon": 80.4365},
    {"id": 14, "name": "Gultekdi Mandi", "city": "Pune", "state": "Maharashtra", "lat": 18.4962, "lon": 73.8662},
    {"id": 15, "name": "Mahuva Mandi", "city": "Mahuva", "state": "Gujarat", "lat": 21.0912, "lon": 71.7612},
]

COMMODITIES = [
    {"id": 1, "name": "Potato (Aloo)", "category": "Vegetable", "unit": "Quintal"},
    {"id": 2, "name": "Tomato (Tamatar)", "category": "Vegetable", "unit": "Quintal"},
    {"id": 3, "name": "Onion (Pyaz)", "category": "Vegetable", "unit": "Quintal"},
    {"id": 4, "name": "Wheat (Gehun)", "category": "Grain", "unit": "Quintal"},
    {"id": 5, "name": "Rice (Chawal)", "category": "Grain", "unit": "Quintal"},
    {"id": 6, "name": "Moong Dal", "category": "Pulse", "unit": "Quintal"},
    {"id": 7, "name": "Arhar Dal", "category": "Pulse", "unit": "Quintal"},
    {"id": 8, "name": "Green Chilli", "category": "Vegetable", "unit": "Quintal"},
    {"id": 9, "name": "Garlic (Lahsun)", "category": "Vegetable", "unit": "Quintal"},
    {"id": 10, "name": "Ginger (Adrak)", "category": "Vegetable", "unit": "Quintal"},
    {"id": 11, "name": "Mustard (Sarson)", "category": "Oilseed", "unit": "Quintal"},
    {"id": 12, "name": "Soybean", "category": "Oilseed", "unit": "Quintal"},
    {"id": 13, "name": "Cotton (Kapas)", "category": "Fiber", "unit": "Quintal"},
    {"id": 14, "name": "Turmeric (Haldi)", "category": "Spice", "unit": "Quintal"},
    {"id": 15, "name": "Cumin (Jeera)", "category": "Spice", "unit": "Quintal"},
    {"id": 16, "name": "Maize (Makka)", "category": "Grain", "unit": "Quintal"},
    {"id": 17, "name": "Brinjal (Baingan)", "category": "Vegetable", "unit": "Quintal"},
    {"id": 18, "name": "Cauliflower (Phool Gobi)", "category": "Vegetable", "unit": "Quintal"},
    {"id": 19, "name": "Cabbage (Patta Gobi)", "category": "Vegetable", "unit": "Quintal"},
    {"id": 20, "name": "Lady Finger (Bhindi)", "category": "Vegetable", "unit": "Quintal"},
]

def generate_market_data():
    data = []
    base_prices = {
        1: 1200, 2: 2500, 3: 1800, 4: 2200, 5: 3500,
        6: 7500, 7: 8500, 8: 4000, 9: 6000, 10: 8000,
        11: 5500, 12: 4800, 13: 6500, 14: 7000, 15: 25000,
        16: 1900, 17: 1500, 18: 2000, 19: 1200, 20: 3000
    }
    
    for mandi in MANDIS:
        for comm in COMMODITIES:
            variation = random.uniform(0.9, 1.1)
            price = int(base_prices[comm["id"]] * variation)
            trend = random.choice(["up", "down", "stable"])
            data.append({
                "mandi_id": mandi["id"],
                "mandi_name": mandi["name"],
                "commodity_id": comm["id"],
                "commodity_name": comm["name"],
                "category": comm["category"],
                "price": price,
                "unit": comm["unit"],
                "trend": trend,
                "last_updated": datetime.datetime.now().isoformat()
            })
    return data

# --- Routes ---

@app.get("/")
def home():
    return {"status": "AI Engine Live", "location": "IET Lucknow"}

# Settings Endpoints
@app.get("/settings")
async def get_settings(db: Session = Depends(get_db)):
    settings = db.query(UserSettings).first()
    if not settings:
        return {
            "full_name": "Farmer",
            "state": "",
            "primary_crop": "",
            "farm_size": 0,
            "language": "en",
            "notifications_enabled": {"sms": True, "email": True, "app": True},
            "theme": "light"
        }
    return settings

@app.post("/settings")
async def update_settings(data: dict, db: Session = Depends(get_db)):
    settings = db.query(UserSettings).first()
    if not settings:
        settings = UserSettings(**data)
        db.add(settings)
    else:
        for key, value in data.items():
            setattr(settings, key, value)
    db.commit()
    db.refresh(settings)
    return settings

# Advisor Endpoints
class ChatInput(BaseModel):
    prompt: str
    language: str = "en"

@app.post("/ask-advisor")
async def ask_advisor(user_input: ChatInput):
    lang_directive = "strictly in Hindi text (using Devanagari script)." if user_input.language == "hi" else "strictly in English."
    system_instruction = f"You are an expert Indian Agricultural Scientist. Provide crisp, concise, and highly organized advice. Use actionable bullet points. Limit your entire response to 2-3 short sentences total. You must reply {lang_directive} Do not write long paragraphs."
    try:
        response = generate_content_with_fallback(
            contents_payload=f"{system_instruction} Question: {user_input.prompt}"
        )
        return {"answer": response.text}
    except Exception as e:
        print("GEMINI ERROR in /ask-advisor:", e)
        return {"error": str(e)}

# Diagnostic Endpoints
@app.post("/diagnose")
async def diagnose_plant(file: UploadFile = File(...), language: str = Form("en"), db: Session = Depends(get_db)):
    file_ext = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    try:
        content = await file.read()
        with open(file_path, "wb") as f:
            f.write(content)
        
        image = Image.open(io.BytesIO(content))
        
        lang_directive = "IMPORTANT: Reply STRICTLY in pure Hindi text (using Devanagari script). Do not use English." if language == "hi" else "IMPORTANT: Reply STRICTLY in pure English."
        system_prompt = f"""
        You are an expert Plant Pathologist. Analyze the attached image of a plant and provide a crisp and highly organized diagnostic report in JSON format.
        {lang_directive}
        JSON fields MUST be exactly: 'diseases' (list of {{"name": "disease name", "confidence": number}}), 'treatment' (short 2-step actionable bullet points), 'severity' (string Low/Medium/High), 'timeline' (very short string), 'prevention' (1 short sentence), 'description' (1 short sentence). Keep all text extremely crisp and short.
        """
        
        response = generate_content_with_fallback(
            contents_payload=[system_prompt, image]
        )
        
        raw_text = response.text
        if "```json" in raw_text:
            raw_text = raw_text.split("```json")[1].split("```")[0].strip()
        elif "```" in raw_text:
            raw_text = raw_text.split("```")[1].split("```")[0].strip()
            
        try:
            diagnostic_result = json.loads(raw_text)
        except:
            diagnostic_result = {"description": raw_text, "diseases": [], "treatment": "N/A", "severity": "Unknown", "timeline": "N/A", "prevention": "N/A"}

        history_entry = DiagnosticHistory(image_filename=filename, result=diagnostic_result)
        db.add(history_entry)
        db.commit()
        db.refresh(history_entry)
        
        return {"id": history_entry.id, "timestamp": history_entry.timestamp, "image_url": f"/uploads/{filename}", "result": diagnostic_result}
    except Exception as e:
        print("GEMINI ERROR in /diagnose:", e)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/diagnostic-history")
async def get_diagnostic_history(db: Session = Depends(get_db)):
    history = db.query(DiagnosticHistory).order_by(DiagnosticHistory.timestamp.desc()).all()
    return [{"id": item.id, "timestamp": item.timestamp, "image_url": f"/uploads/{item.image_filename}", "result": item.result} for item in history]

# Market Endpoints
@app.get("/market/prices")
async def get_market_prices(category: str = None):
    data = generate_market_data()
    if category:
        data = [d for d in data if d["category"].lower() == category.lower()]
    return data

@app.get("/market/trends/{commodity_id}")
async def get_commodity_trends(commodity_id: int):
    comm = next((c for c in COMMODITIES if c["id"] == commodity_id), None)
    if not comm:
        raise HTTPException(status_code=404, detail="Commodity not found")
        
    prices_map = {1: 1200, 2: 2500, 3: 1800, 4: 2200, 5: 3500, 6: 7500, 7: 8500, 8: 4000, 9: 6000, 10: 8000, 11: 5500, 12: 4800, 13: 6500, 14: 7000, 15: 25000, 16: 1900, 17: 1500, 18: 2000, 19: 1200, 20: 3000}
    base_price = prices_map.get(commodity_id, 2000)
    
    trends = []
    for i in range(7):
        date = (datetime.datetime.now() - datetime.timedelta(days=6-i)).strftime("%Y-%m-%d")
        trends.append({"date": date, "price": int(base_price * random.uniform(0.85, 1.15))})
    return {"commodity": comm["name"], "trends": trends}

@app.get("/market/recommendations")
async def get_recommendations(lat: float, lon: float, commodity_id: int = None):
    def calculate_distance(lat1, lon1, lat2, lon2):
        return math.sqrt((lat1-lat2)**2 + (lon1-lon2)**2) * 111
        
    mandi_distances = [{"mandi": m, "distance": calculate_distance(lat, lon, m["lat"], m["lon"])} for m in MANDIS]
    mandi_distances.sort(key=lambda x: x["distance"])
    nearby_mandis = mandi_distances[:5]
    nearby_mandi_ids = [m["mandi"]["id"] for m in nearby_mandis]
    
    data = generate_market_data()
    recommendations = []
    target_commodities = [commodity_id] if commodity_id else [1, 2, 3, 4, 5]
    
    for comm_id in target_commodities:
        comm_prices = [d for d in data if d["commodity_id"] == comm_id]
        if not comm_prices: continue
        
        best_overall = max(comm_prices, key=lambda x: x["price"])
        nearby_prices = [d for d in comm_prices if d["mandi_id"] in nearby_mandi_ids]
        best_nearby = max(nearby_prices, key=lambda x: x["price"]) if nearby_prices else best_overall
        
        recommendations.append({
            "commodity_name": best_overall["commodity_name"],
            "best_nearby_mandi": best_nearby["mandi_name"],
            "best_nearby_price": best_nearby["price"],
            "best_overall_mandi": best_overall["mandi_name"],
            "best_overall_price": best_overall["price"],
            "profit_optimization": f"Selling at {best_overall['mandi_name']} could earn you {best_overall['price'] - best_nearby['price']} more per quintal."
        })
        
    return recommendations
