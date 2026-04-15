# 🎬 Movie.wine

![Movie.wine Hero](C:\Users\Nishant\.gemini\antigravity\brain\3d76ca13-9ef3-454c-9717-125b5d6d84e0\movie_wine_hero_1776273553958.png)

> **Where Cinema Meets Community.**  
> A premium, AI-powered movie tracking and social platform designed for true cinephiles.

---

## ✨ Features

### 🤖 AI-Curated Recommendations
Intelligent suggestion engine powered by Gemini & TMDB, learning your taste to provide deeply personalized and explainable recommendations.

### 🏛️ Premium Vault & Editorials
A high-end space for deep dives, cinematic analysis, and editorial discussions. Featuring a "Midnight Gold" aesthetic.

### 👥 Social & Community
- **Discussions**: Start threads on your favorite (or least favorite) films.
- **Watch Parties**: Schedule and join live watching events with the community.
- **Comments**: Share quick thoughts on any movie or series.

### 📊 tracking & Lists
- **Watchlist**: Never miss a title.
- **Watched History**: Track your cinematic journey with detailed stats and runtime calculations.
- **Custom Lists**: Curate and share your own collections.

### 🔔 Real-time Notifications
Stay updated with likes, replies, and upcoming watch parties.

---

## 🚀 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | [Next.js 15](https://nextjs.org/), [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/) |
| **Backend** | [FastAPI](https://fastapi.tiangolo.com/) (Python) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) (via [Neon DB](https://neon.tech/)) |
| **Auth** | [Clerk](https://clerk.com/) |
| **ORM** | [SQLAlchemy](https://www.sqlalchemy.org/) |
| **AI** | [Google Gemini](https://ai.google.dev/) + NLP Embeddings |
| **Media Data** | [TMDB API](https://www.themoviedb.org/documentation/api) |

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- TMDB API Key
- Clerk API Keys
- Neon DB Connection String

### Backend Setup
1. Navigate to `/backend`
2. Install dependencies: `pip install -r requirements.txt`
3. Configure `.env` with DB and API keys.
4. Run the server: `python main.py`

### Frontend Setup
1. Navigate to `/frontend`
2. Install dependencies: `npm install`
3. Configure `.env.local` with Clerk and Backend URLs.
4. Run the dev server: `npm run dev`

---

## 🧠 AI & ML Architecture

The recommendation engine follows a **hybrid AI approach**:
- **Content-based NLP**: Converting movie metadata into 384-dimensional semantic vectors using Sentence Transformers.
- **Behavioral Modeling**: Building user preference vectors from interactions (views, likes, watchlist).
- **Explainable AI (XAI)**: Providing "Why this recommended" tooltips based on feature similarity.

---

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">Made with ❤️ for Cinema</p>
