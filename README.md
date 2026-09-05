# 🗣️ Advanced Spoken English Level 1 – Daily Practice Tracker

A mobile-first web application designed for students enrolled in **Advanced Spoken English Level 1** to track daily speaking practice (with ChatGPT Voice) and listening activities. Features a **Creative Minimal UI** powered by Iconify vector icons and **PocketBase** database integration.

---

## ✨ Key Features

### 🎓 Student Portal
- **20-Min ChatGPT Voice Speaking Practice**: Daily custom topic with ready-made 1-click copy prompt tool.
- **Curated Listening Drills**: Embedded responsive YouTube video lessons and shadowing exercises.
- **Streak & Consistency Counter**: Day streak counter (🔥), total speaking completed, and total listening completed.
- **Weekly History Table**: Mon–Sun breakdown showing daily completion badges.

### 👩‍🏫 Instructor / Admin Dashboard
- **Participation Overview**: Metrics for total students, speaking completed today, listening completed today, and inactive students.
- **Student Roster & Monitoring**: Filter students by *All*, *Speaking Done*, *Listening Done*, or *Inactive Today*.
- **Student Management**: Add, edit, activate/deactivate, or delete student accounts.
- **Daily Content Publisher**: Date picker to publish daily speaking topics, ChatGPT prompts, and listening videos.

---

## 🚀 Tech Stack

- **Frontend**: HTML5, Vanilla JavaScript (ES6+), Vanilla CSS (Creative Minimal Design System)
- **Icons**: Iconify Framework (Lucide & Phosphor vector icon sets)
- **Database**: PocketBase (https://pocketbase.io) + Local Storage Fallback Mode
- **Hosting Ready**: Compatible out-of-the-box with **GitHub Pages**, Vercel, or Netlify.

---

## ⚡ Instant Demo Credentials

You can test the application right away:

- **Student Portal**: `sarah@englishlevel1.com` / `student123`
- **Instructor Dashboard**: `shiblkp` / `340340`

---

## 📂 Project Structure

```text
├── index.html               # Main Single-Page HTML application & Landing Page
├── styles.css               # Creative Minimal CSS design system
├── js/
│   ├── pocketbase-config.js # PocketBase client configuration & health check
│   ├── db.js                # Data abstraction layer & completion stats
│   └── app.js               # Application views router & UI controllers
├── .gitignore               # Git ignore rules
└── README.md                # Documentation & setup instructions
```

---

## 📦 How to Upload to GitHub

### Option A: Uploading via Git CLI

Run these commands in your project folder:

```bash
# 1. Initialize Git repository
git init

# 2. Add all project files
git add .

# 3. Commit files
git commit -m "Initial commit - Advanced Spoken English Level 1 Tracker"

# 4. Rename main branch
git branch -M main

# 5. Link your GitHub repository (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/spoken-english-tracker.git

# 6. Push code to GitHub
git push -u origin main
```

---

### Option B: Uploading via GitHub Web Interface

1. Go to [github.com/new](https://github.com/new) and create a repository named `spoken-english-tracker`.
2. Click **"uploading an existing file"**.
3. Drag and drop all files from your folder (`index.html`, `styles.css`, `js/`, `.gitignore`, `README.md`).
4. Click **Commit changes**.

---

## 🌐 Deploying to GitHub Pages (Free Hosting)

1. Go to your repository on GitHub.
2. Click **Settings** ➔ **Pages**.
3. Under **Branch**, select `main` and click **Save**.
4. Your website will be live in 1–2 minutes at `https://YOUR_USERNAME.github.io/spoken-english-tracker/`!
