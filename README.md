# 🌅 Morning Briefing Dashboard

A beautiful, modern news dashboard that aggregates news, weather, crypto prices, and daily quotes. Built with React, FastAPI, and SQLite for historical news storage.

![Dashboard Preview](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Morning+Briefing+Dashboard)

## ✨ Features

- **📰 Real-time News**: Aggregates news from BBC, The Guardian, and Al Jazeera
- **🌤️ Weather Data**: Current weather for any city/country
- **💰 Crypto Prices**: Real-time cryptocurrency prices
- **💭 Daily Quotes**: Inspirational quotes of the day
- **📅 Historical News**: SQLite database for storing and retrieving past news
- **🎨 Modern UI**: Beautiful, responsive design with Tailwind CSS
- **📱 Mobile Friendly**: Fully responsive across all devices

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd news-script
   ```

2. **Set up the backend**

   ```bash
   # Create virtual environment
   python -m venv venv

   # Activate virtual environment
   # On macOS/Linux:
   source venv/bin/activate
   # On Windows:
   venv\Scripts\activate

   # Install dependencies
   cd backend
   pip install -r requirements.txt
   ```

3. **Set up environment variables**

   ```bash
   # Create .env file in backend directory
   cd backend
   touch .env
   ```

   Add your API keys to `backend/.env`:

   ```env
   OPENWEATHER_API_KEY=your_openweather_api_key_here
   FRONTEND_ORIGIN=http://localhost:5173
   ```

4. **Set up the frontend**

   ```bash
   cd frontend
   npm install
   ```

5. **Start the development servers**

   **Terminal 1 - Backend:**

   ```bash
   cd backend
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   python app.py
   ```

   **Terminal 2 - Frontend:**

   ```bash
   cd frontend
   npm run dev
   ```

6. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000

## 🔧 API Keys Setup

### OpenWeather API (Required for weather data)

1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Get your API key
4. Add it to `backend/.env` as `OPENWEATHER_API_KEY`

## 📁 Project Structure

```
news-script/
├── backend/
│   ├── app.py              # FastAPI server
│   ├── database.py         # SQLite database operations
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Environment variables
├── frontend/
│   ├── src/
│   │   ├── App.tsx        # Main React component
│   │   ├── index.css      # Tailwind CSS
│   │   └── ...
│   ├── package.json       # Node dependencies
│   └── ...
└── README.md
```

## 🎯 Usage

### Dashboard Features

1. **Weather Section**: Enter any city and country to get current weather
2. **Crypto Section**: View real-time prices for Bitcoin, Ethereum, and other cryptocurrencies
3. **News Section**: Browse latest headlines from multiple sources
4. **Historical News**:
   - Load yesterday's news
   - Filter by specific date
   - Filter by news source (BBC, The Guardian, Al Jazeera)
5. **Quote of the Day**: Daily inspirational quotes

### API Endpoints

- `GET /api/news` - Get latest news
- `GET /api/weather?city={city}&country={country}` - Get weather data
- `GET /api/crypto?ids={coins}&vs={currency}` - Get crypto prices
- `GET /api/quote` - Get daily quote
- `GET /api/news/yesterday` - Get yesterday's news
- `GET /api/news/date/{date}` - Get news by date (YYYY-MM-DD)
- `GET /api/news/source/{source}` - Get news by source

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

**Frontend + Backend:**

1. Push your code to GitHub
2. Connect your repo to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Option 2: Railway

**Full-stack deployment:**

1. Push your code to GitHub
2. Connect to [Railway](https://railway.app)
3. Add environment variables
4. Deploy with automatic builds

### Option 3: Netlify + Railway

**Hybrid approach:**

1. Deploy frontend to [Netlify](https://netlify.com)
2. Deploy backend to [Railway](https://railway.app)
3. Update frontend API URL to point to Railway backend

### Option 4: GitHub Pages (Frontend Only)

**Static deployment:**

1. Build the frontend: `npm run build`
2. Deploy to GitHub Pages
3. Note: News functionality will be limited without backend

## 🛠️ Development

### Adding New News Sources

1. Update the `feeds` array in `backend/app.py`:

   ```python
   feeds = [
       ("https://feeds.bbci.co.uk/news/world/rss.xml", "BBC"),
       ("https://www.theguardian.com/world/rss", "The Guardian"),
       ("https://www.aljazeera.com/xml/rss/all.xml", "Al Jazeera"),
       ("https://new-source.com/rss", "New Source"),  # Add here
   ]
   ```

2. Update the source dropdown in `frontend/src/App.tsx`:
   ```tsx
   <option value="New Source">New Source</option>
   ```

### Customizing the UI

The dashboard uses Tailwind CSS for styling. Key files to modify:

- `frontend/src/App.tsx` - Main component and layout
- `frontend/src/index.css` - Global styles and Tailwind imports
- `frontend/tailwind.config.js` - Tailwind configuration

## 🐛 Troubleshooting

### Common Issues

1. **"python: command not found"**
   - Make sure your virtual environment is activated
   - Use `python3` instead of `python` on some systems

2. **"ModuleNotFoundError"**
   - Ensure you're in the correct directory
   - Check that all dependencies are installed: `pip install -r requirements.txt`

3. **Weather API not working**
   - Verify your OpenWeather API key is correct
   - Check that the key is in `backend/.env`

4. **News not loading**
   - Check your internet connection
   - RSS feeds might be temporarily unavailable

5. **Frontend not connecting to backend**
   - Ensure backend is running on port 8000
   - Check CORS settings in `backend/app.py`


---

**Built with ❤️ using React, FastAPI, and Tailwind CSS**
