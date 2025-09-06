import requests
from bs4 import BeautifulSoup

URL = "https://www.bbc.com/news"
response = requests.get(URL)
soup = BeautifulSoup(response.text, "html.parser")

# Grab headline tags more reliably
headlines = soup.select("h2, h3")  # find both h2 and h3

print("Latest BBC Headlines:\n")
for i, headline in enumerate(headlines[:10], start=1):
    print(f"{i}. {headline.get_text(strip=True)}")
