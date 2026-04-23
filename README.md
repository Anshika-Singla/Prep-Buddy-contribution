# 📚 Prep Buddy — Placement Preparation Tracker

A full-stack placement preparation platform for engineering students. Track DSA, Core subjects, and Aptitude, get AI-powered study assistance, and discover real job listings after reaching 60% completion.

---

## ✨ Features

- **Progress Tracking** — DSA, Core CS, and Aptitude topics with completion tracking
- **Streak System** — Daily streak to keep you consistent
- **AI Chatbot** — Powered by Groq (Llama 3.1) for DSA, aptitude, and interview prep help
- **Job Discovery** — Real jobs via JSearch API, unlocked after 60% completion
- **PDF Resources** — Google Drive links for study material per topic
- **Revision Reminders** — Bookmark topics for revision the next day
- **Study Accuracy** — Tracks whether you open resources before marking topics done

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Tailwind CSS, Framer Motion, Vite |
| Backend | Node.js, Express |
| Database | MongoDB Atlas (Mongoose) |
| AI Chat | Groq API (llama-3.1-8b-instant) |
| Jobs | JSearch via RapidAPI |
| Auth | JWT (jsonwebtoken + bcryptjs) |

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ installed
- A MongoDB Atlas account (free)
- A Groq API key (free) — https://console.groq.com
- A RapidAPI key for JSearch (free tier) — https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch

---

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/prep-buddy.git
cd prep-buddy
```

---

### 2. Frontend Setup

```bash
# Install dependencies
npm install

# Create your environment file
cp .env.example .env
```

Edit `.env` and set:
```
VITE_API_URL=http://localhost:3000
```

---

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create your environment file
cp .env.example .env
```

Edit `backend/.env` with your own credentials:
```
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/?appName=YourApp
JWT_SECRET=pick_any_long_random_string_here
FRONTEND_URL=http://localhost:5173
GROQ_API_KEY=gsk_your_groq_api_key_here
RAPIDAPI_KEY=your_rapidapi_key_here
```

#### How to get each key:

| Key | Where to get |
|-----|-------------|
| `MONGODB_URI` | [MongoDB Atlas](https://cloud.mongodb.com) → Create free cluster → Connect → Drivers → copy URI |
| `JWT_SECRET` | Any random string, e.g. run: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `GROQ_API_KEY` | [console.groq.com](https://console.groq.com) → API Keys → Create key |
| `RAPIDAPI_KEY` | [RapidAPI JSearch](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch) → Subscribe Free → copy key |

---

### 4. Run the App

Open **two terminals**:

**Terminal 1 — Backend:**
```bash
cd backend
node server.js
```
You should see: `Backend running at http://localhost:3000`

**Terminal 2 — Frontend:**
```bash
npm run dev
```
You should see: `VITE ready at http://localhost:5173`

Open **http://localhost:5173** in your browser.

---

## 📁 Project Structure

```
prep-buddy/
├── src/
│   ├── pages/          # Dashboard, DSA, Core, Aptitude, Jobs, Chat
│   ├── components/     # Navbar, JobCard, SkeletonCard
│   ├── context/        # ProfileContext (global state)
│   ├── lib/            # api.js (centralized fetch helper)
│   └── data/           # dsaData.js, coreData.js, aptitudeData.js
├── backend/
│   ├── server.js       # Express API server
│   ├── catalogSeedData.js  # Topic catalog seeder
│   └── .env.example    # Environment variable template
├── .env.example        # Frontend env template
└── README.md
```

---

## 🔒 Environment Variables

**Never commit `.env` files.** They are already in `.gitignore`.  
Always use the `.env.example` files as templates.

---

## 📝 Notes

- Jobs are locked until the user reaches **60% overall completion**
- Below 60%, the app shows demo Indian job listings (Infosys, TCS, Zomato, etc.)
- The AI chatbot is aware of the user's progress and streak for personalised responses
- MongoDB stores user progress, streaks, and revision reminders per account