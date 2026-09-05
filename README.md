# 🗣️ Advanced Spoken English Level 1 – Daily Practice Tracker

A mobile-first web application designed for students enrolled in **Advanced Spoken English Level 1** to track daily speaking practice (with ChatGPT Voice) and listening activities. Features a **Creative Minimal UI** powered by Iconify vector icons and **Firebase Firestore** database integration.

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
- **Database**: Firebase Firestore (`mediacap-1`) + Local Storage Fallback Mode
- **Hosting Ready**: Compatible out-of-the-box with **GitHub Pages**, Render, Vercel, or Netlify.

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
│   ├── firebase-config.js   # Firebase client configuration & initialization
│   ├── db.js                # Data abstraction layer & completion stats
│   └── app.js               # Application views router & UI controllers
├── .gitignore               # Git ignore rules
└── README.md                # Documentation & setup instructions
```

---

## 🌐 Deploying to GitHub Pages (Free Hosting)

1. Go to your repository on GitHub (`https://github.com/dezignmvs/shiblengl`).
2. Click **Settings** ➔ **Pages**.
3. Under **Branch**, select `main` and click **Save**.
4. Your website will be live in 1–2 minutes at `https://dezignmvs.github.io/shiblengl/`!
