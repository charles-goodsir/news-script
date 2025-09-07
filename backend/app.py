import os
import random
import requests
import feedparser
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pathlib import Path
from database import NewsDatabase

# Explicitly load .env from the backend folder
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)


app = FastAPI(title="Morning Briefing API")

# Initialize the database
db = NewsDatabase()

origins = [os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def parse_feed(url: str, source: str, limit: int):
    import requests
    import xml.etree.ElementTree as ET

    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, timeout=10, headers=headers)
        response.raise_for_status()
        
        # Parse XML
        root = ET.fromstring(response.content)
        items = []
        
        # Find all item elements
        for item in root.findall('.//item')[:limit]:
            title_elem = item.find('title')
            link_elem = item.find('link')
            pub_elem = item.find('pubDate')
            
            if title_elem is not None:
                items.append({
                    "source": source,
                    "title": title_elem.text.strip() if title_elem.text else "",
                    "link": link_elem.text if link_elem is not None and link_elem.text else "",
                    "published": pub_elem.text if pub_elem is not None and pub_elem.text else "",
                })
        
        print(f"Parsing {source}: {len(items)} entries found")
        return items
        
    except Exception as e:
        print(f"Error parsing {source}: {e}")
        return []


@app.get("/api/news")
def get_news(limit: int = 5):
    feeds = [
        ("https://feeds.bbci.co.uk/news/world/rss.xml", "BBC"),
        ("https://www.theguardian.com/world/rss", "The Guardian"),
        ("https://www.aljazeera.com/xml/rss/all.xml", "Al Jazeera"),
    ]
    all_items = []
    for url, src in feeds:
        try:
            all_items.extend(parse_feed(url, src, limit))
        except Exception as e:
            print(f"Error parsing feed {url}: {e}")
            continue
    
    # Save news to database
    if all_items:
        db.save_news(all_items)
    
    return {"items": all_items}


@app.get("/api/news/yesterday")
def get_yesterdays_news():
    """Get yesterday's news from the database"""
    yesterdays_news = db.get_yesterdays_news()
    return {"items": yesterdays_news}


@app.get("/api/news/date/{date}")
def get_news_by_date(date: str):
    """Get news from a specific date (YYYY-MM-DD)"""
    news = db.get_news_by_date(date)
    return {"items": news}


@app.get("/api/news/source/{source}")
def get_news_by_source(source: str, days: int = 7):
    """Get news from a specific source"""
    news = db.get_news_by_source(source, days)
    return {"items": news}


@app.get("/api/weather")
def get_weather(city: str = "Auckland", country: str = "NZ"):
    api_key = os.getenv("OPENWEATHER_API_KEY")
    if not api_key:
        return {"error": "Missing WEATHER_API_KEY in environment"}

    url = f"http://api.openweathermap.org/data/2.5/weather?q={city},{country}&appid={api_key}&units=metric"
    data = requests.get(url).json()
    return {
        "city": data["name"],
        "temp": data["main"]["temp"],
        "description": data["weather"][0]["description"],
    }


@app.get("/api/crypto")
def get_crypto(ids: str = "bitcoin, ethereum", vs: str = "usd"):
    url = "https://api.coingecko.com/api/v3/simple/price"
    params = {"ids": ids, "vs_currencies": vs}
    r = requests.get(url, params=params, timeout=15)
    data = r.json()
    if r.status_code != 200 or not isinstance(data, dict):
        raise HTTPException(status_code=502, detail="Crypto API Failed")
    return data


@app.get("/api/quote")
def get_quote():
    quotes = [
        {"text": "Stay hungry, stay foolish.", "author": "Steve Jobs"},
        {"text": "What we think, we become.", "author": "Buddha"},
        {
            "text": "Simplicity is the ultimate sophistication.",
            "author": "Leonardo da Vinci",
        },
        {"text": "Well begun is half done.", "author": "Aristotle"},
        {"text": "Make it work, make it right, make it fast.", "author": "Kent Beck"},
    ]
    return random.choice(quotes)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)