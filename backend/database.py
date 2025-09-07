import sqlite3
import os
from datetime import datetime, timedelta
from typing import List, Dict

class NewsDatabase:
    def __init__(self, db_path: str = "news.db"):
        self.db_path = db_path
        self.init_database()

    def init_database(self):
        """Create the news table if it doesn't exist"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS news (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                link TEXT NOT NULL,
                source TEXT NOT NULL,
                published TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        conn.commit()
        conn.close()

    def save_news(self, news_items: List[Dict]):
        """Save news items to the database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        for item in news_items:
            cursor.execute('''
                INSERT INTO news (title, link, source, published)
                VALUES (?, ?, ?, ?)
            ''', (item['title'], item['link'], item['source'], item['published']))

        conn.commit()
        conn.close()

    def get_news_by_date(self, date: str) -> List[Dict]:
        """Get news from a specific date (YYYY-MM-DD format)"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute('''
            SELECT title, link, source, published, created_at
            FROM news
            WHERE DATE(created_at) = ?
            ORDER BY created_at DESC
        ''', (date,))

        results = cursor.fetchall()
        conn.close()

        return [
            {
                'title': row[0],
                'link': row[1],
                'source': row[2],
                'published': row[3],
                'created_at': row[4]
            }
            for row in results
        ]

    def get_yesterdays_news(self) -> List[Dict]:
        """Get news from yesterday"""
        yesterday = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d')
        return self.get_news_by_date(yesterday)

    def get_news_by_source(self, source: str, days: int = 7) -> List[Dict]:
        """Get news from a specific source within the last N days"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute('''
            SELECT title, link, source, published, created_at
            FROM news
            WHERE source = ? AND created_at >= datetime('now', '-{} days')
            ORDER BY created_at DESC
        '''.format(days), (source,))

        results = cursor.fetchall()
        conn.close()

        return [
            {
                'title': row[0],
                'link': row[1],
                'source': row[2],
                'published': row[3],
                'created_at': row[4]
            }
            for row in results
        ]