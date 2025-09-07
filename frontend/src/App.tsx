import { useEffect, useState } from 'react';

type Headline = {
  source: string;
  title: string;
  link: string;
  published?: string;
};
type Weather = {
  city: string;
  temp: number;
  description: string;
  icon: string;
};
type CryptoData = Record<string, Record<string, number>>;

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function App() {
  const [historicalNews, setHistoricalNews] = useState<Headline[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSource, setSelectedSource] = useState<string>('');
  const [news, setNews] = useState<Headline[]>([]);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [crypto, setCrypto] = useState<CryptoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('Auckland');
  const [country, setCountry] = useState('NZ');
  const [coins, setCoins] = useState('bitcoin,ethereum');
  const [vs, setVs] = useState('nzd');
  const [quote, setQuote] = useState<{ text: string; author?: string } | null>(
    null
  );

  useEffect(() => {
    async function load() {
      try {
        const [newsRes, weatherRes, cryptoRes, quoteRes] = await Promise.all([
          fetch(`${API}/api/news`).then((r) => r.json()),
          fetch(
            `${API}/api/weather?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`
          ).then((r) => r.json()),
          fetch(
            `${API}/api/crypto?ids=${encodeURIComponent(coins)}&vs=${encodeURIComponent(vs)}`
          ).then((r) => r.json()),
          fetch(`${API}/api/quote`).then((r) => r.json()),
        ]);
        setNews(newsRes.items || []);
        setWeather(weatherRes);
        setCrypto(cryptoRes);
        setQuote(quoteRes);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [city, country, coins, vs]);

  const refresh = async () => {
    setLoading(true);
    try {
      const [newsRes, weatherRes, cryptoRes, quoteRes] = await Promise.all([
        fetch(`${API}/api/news`).then((r) => r.json()),
        fetch(
          `${API}/api/weather?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`
        ).then((r) => r.json()),
        fetch(
          `${API}/api/crypto?ids=${encodeURIComponent(coins)}&vs=${encodeURIComponent(vs)}`
        ).then((r) => r.json()),
        fetch(`${API}/api/quote`).then((r) => r.json()),
      ]);
      setNews(newsRes.items || []);
      setWeather(weatherRes);
      setCrypto(cryptoRes);
      setQuote(quoteRes);
    } finally {
      setLoading(false);
    }
  };
  const fetchYesterdaysNews = async () => {
    try {
      const response = await fetch(`${API}/api/news/yesterday`);
      const data = await response.json();
      setHistoricalNews(data.items || []);
    } catch (error) {
      console.error("Error fetching yesterday's news:", error);
    }
  };

  const fetchNewsByDate = async (date: string) => {
    try {
      const response = await fetch(`${API}/api/news/date/${date}`);
      const data = await response.json();
      setHistoricalNews(data.items || []);
    } catch (error) {
      console.error('Error fetching news by date:', error);
    }
  };

  const fetchNewsBySource = async (source: string, days: number = 7) => {
    try {
      const response = await fetch(
        `${API}/api/news/source/${source}?days=${days}`
      );
      const data = await response.json();
      setHistoricalNews(data.items || []);
    } catch (error) {
      console.error('Error fetching news by source:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                🌅 Morning Briefing
              </h1>
              <p className="mt-2 text-lg text-indigo-100">
                Your daily dose of news, weather & insights
              </p>
            </div>
            <button
              onClick={refresh}
              className="group relative overflow-hidden rounded-2xl bg-white/20 px-6 py-3 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/30 hover:scale-105 hover:shadow-xl"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg
                  className="h-5 w-5 transition-transform group-hover:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </span>
            </button>
          </div>
        </header>

        {/* Controls */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-white/90 p-6 shadow-lg border border-gray-200/50">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 p-2">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-800">
                Weather Location
              </h2>
            </div>
            <div className="flex gap-3">
              <input
                className="w-full rounded-xl border border-gray-300 bg-white p-3 text-gray-700 placeholder-gray-400 transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
              />
              <input
                className="w-24 rounded-xl border border-gray-300 bg-white p-3 text-gray-700 placeholder-gray-400 transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Country"
              />
            </div>
          </div>

          <div className="rounded-2xl bg-white/90 p-6 shadow-lg border border-gray-200/50">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 p-2">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Crypto</h2>
            </div>
            <div className="flex gap-3">
              <input
                className="w-full rounded-xl border border-gray-300 bg-white p-3 text-gray-700 placeholder-gray-400 transition-all duration-200 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20"
                value={coins}
                onChange={(e) => setCoins(e.target.value)}
                placeholder="bitcoin,ethereum"
              />
              <input
                className="w-24 rounded-xl border border-gray-300 bg-white p-3 text-gray-700 placeholder-gray-400 transition-all duration-200 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20"
                value={vs}
                onChange={(e) => setVs(e.target.value)}
                placeholder="usd/nzd"
              />
            </div>
          </div>
          {/* Historical News Controls and Tip */}
          <div className="grid gap-6 md:grid-cols-4">
            <div className="group relative overflow-hidden rounded-3xl bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
              <div className="relative">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 p-2">
                    <svg
                      className="h-5 w-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    Yesterday's News
                  </h2>
                </div>
                <button
                  onClick={fetchYesterdaysNews}
                  style={{
                    width: '100%',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    padding: '12px 16px',
                    borderRadius: '16px',
                    border: '2px solid #1d4ed8',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    cursor: 'pointer',
                  }}
                >
                  Load Yesterday
                </button>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
              <div className="relative">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 p-2">
                    <svg
                      className="h-5 w-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    News by Date
                  </h2>
                </div>
                <div className="space-y-3">
                  <input
                    type="date"
                    className="w-full rounded-2xl border-2 border-gray-200 bg-white/50 p-3 text-gray-700 transition-all duration-200 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/20"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                  <button
                    onClick={() => fetchNewsByDate(selectedDate)}
                    disabled={!selectedDate}
                    style={{
                      width: '100%',
                      backgroundColor: selectedDate ? '#16a34a' : '#9ca3af',
                      color: 'white',
                      padding: '12px 16px',
                      borderRadius: '16px',
                      border: `2px solid ${selectedDate ? '#15803d' : '#6b7280'}`,
                      fontWeight: 'bold',
                      fontSize: '16px',
                      cursor: selectedDate ? 'pointer' : 'not-allowed',
                      opacity: selectedDate ? 1 : 0.6,
                    }}
                  >
                    Load
                  </button>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
              <div className="relative">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 p-2">
                    <svg
                      className="h-5 w-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    News by Source
                  </h2>
                </div>
                <div className="space-y-3">
                  <select
                    className="w-full rounded-2xl border-2 border-gray-200 bg-white/50 p-3 text-gray-700 transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
                    value={selectedSource}
                    onChange={(e) => setSelectedSource(e.target.value)}
                  >
                    <option value="">Select Source</option>
                    <option value="BBC">BBC</option>
                    <option value="The Guardian">The Guardian</option>
                    <option value="Al Jazeera">Al Jazeera</option>
                  </select>
                  <button
                    onClick={() => fetchNewsBySource(selectedSource)}
                    disabled={!selectedSource}
                    style={{
                      width: '100%',
                      backgroundColor: selectedSource ? '#9333ea' : '#9ca3af',
                      color: 'white',
                      padding: '12px 16px',
                      borderRadius: '16px',
                      border: `2px solid ${selectedSource ? '#7c3aed' : '#6b7280'}`,
                      fontWeight: 'bold',
                      fontSize: '16px',
                      cursor: selectedSource ? 'pointer' : 'not-allowed',
                      opacity: selectedSource ? 1 : 0.6,
                    }}
                  >
                    Load
                  </button>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
              <div className="relative">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 p-2">
                    <svg
                      className="h-5 w-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">Tip</h2>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Edit the inputs above, then hit{' '}
                  <span className="font-semibold text-purple-600">Refresh</span>{' '}
                  to update your dashboard with new data.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="space-y-8">
          {/* Weather and Crypto side by side */}
          <div className="grid gap-8 md:grid-cols-2">
            {/* Weather */}
            <section className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
              <div className="relative">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 p-3">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Weather</h2>
                </div>

                {weather ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-800">
                        {weather.city}
                      </div>
                      <div className="text-5xl font-light text-cyan-600">
                        {Math.round(weather.temp)}°C
                      </div>
                      <div className="text-lg capitalize text-gray-600">
                        {weather.description}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-8">
                    <span className="text-gray-400">—</span>
                  </div>
                )}
              </div>
            </section>

            {/* Crypto */}
            <section className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
              <div className="relative">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 p-3">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Crypto</h2>
                </div>

                {crypto ? (
                  <div className="space-y-3">
                    {Object.entries(crypto).map(([coin, prices]) => (
                      <div
                        key={coin}
                        className="flex items-center justify-between rounded-2xl bg-white/50 p-3 backdrop-blur-sm"
                      >
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                          <span className="font-semibold capitalize text-gray-800">
                            {coin.replace('-', ' ')}
                          </span>
                        </div>
                        <span className="font-mono text-sm font-bold text-gray-700">
                          {Object.values(
                            prices as Record<string, number>
                          )[0]?.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-8">
                    <span className="text-gray-400">—</span>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Quote */}
          <section className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-8 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
            <div className="relative">
              <div className="mb-6 flex items-center gap-4">
                <div className="rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 p-3">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Quote of the Day
                </h2>
              </div>

              {quote ? (
                <div className="text-center">
                  <blockquote className="text-xl italic leading-relaxed text-gray-700">
                    "{quote.text}"
                  </blockquote>
                  {quote.author && (
                    <cite className="mt-4 block text-lg font-semibold text-purple-600 not-italic">
                      — {quote.author}
                    </cite>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center py-8">
                  <span className="text-gray-400">—</span>
                </div>
              )}
            </div>
          </section>

          {/* News */}
          <section className="group relative overflow-hidden rounded-3xl bg-white/90 p-8 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <div className="relative">
              <div className="mb-6 flex items-center gap-4">
                <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 p-3">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Top Headlines
                </h2>
              </div>

              {loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                    <span className="text-gray-600">
                      Loading latest news...
                    </span>
                  </div>
                </div>
              )}

              {!loading && (
                <div className="space-y-4">
                  {news.map((n, i) => (
                    <article
                      key={i}
                      className="group/article relative overflow-hidden rounded-2xl border border-gray-200/50 bg-white/50 p-5 transition-all duration-300 hover:border-blue-300/50 hover:bg-white hover:shadow-lg"
                    >
                      <a
                        href={n.link}
                        target="_blank"
                        rel="noreferrer"
                        className="block"
                      >
                        <h3 className="mb-3 text-lg font-semibold leading-tight text-gray-800 transition-colors duration-200 group-hover/article:text-blue-600">
                          {n.title}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                            {n.source}
                          </span>
                          {n.published && (
                            <span className="text-gray-400">
                              {new Date(n.published).toLocaleDateString(
                                'en-US',
                                {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                }
                              )}
                            </span>
                          )}
                        </div>
                      </a>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Historical News */}
          {historicalNews.length > 0 && (
            <section className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-8 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
              <div className="relative">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 p-3">
                      <svg
                        className="h-6 w-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Historical News
                    </h2>
                  </div>
                  <button
                    onClick={() => setHistoricalNews([])}
                    className="rounded-2xl bg-gray-500 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-gray-600 hover:shadow-lg"
                  >
                    Clear
                  </button>
                </div>

                <div className="space-y-4">
                  {historicalNews.map((n, i) => (
                    <article
                      key={i}
                      className="group/article relative overflow-hidden rounded-2xl border border-gray-200/50 bg-white/50 p-5 transition-all duration-300 hover:border-green-300/50 hover:bg-white hover:shadow-lg"
                    >
                      <a
                        href={n.link}
                        target="_blank"
                        rel="noreferrer"
                        className="block"
                      >
                        <h3 className="mb-3 text-lg font-semibold leading-tight text-gray-800 transition-colors duration-200 group-hover/article:text-green-600">
                          {n.title}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                            {n.source}
                          </span>
                          {n.published && (
                            <span className="text-gray-400">
                              {new Date(n.published).toLocaleDateString(
                                'en-US',
                                {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                }
                              )}
                            </span>
                          )}
                        </div>
                      </a>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
