# 7-Day Plan: Blogging Platform (Deadline: Tue 10 Nov 2026)

Rule: keep it simple. Only what the assignment asks: register/login, write post, edit post, view posts, comments. No extras.

Stack: React (Vite) + Node.js/Express + MySQL

| Day | Date | What to do | Done when |
|-----|------|-----------|-----------|
| 1 | Wed 4 Nov | Install Node.js, MySQL, Git, VS Code. Create GitHub repo `blog-platform`. Run `backend/schema.sql` in MySQL. Copy `.env.example` to `.env`, fill DB password. Run backend (`npm install`, `npm start`). | Opening http://localhost:5000 shows "Blog API running" |
| 2 | Thu 5 Nov | Test every backend API in Postman (register, login, create post, edit, delete, comment). Read through `routes/` so you can explain it. | All APIs return correct responses |
| 3 | Fri 6 Nov | Run frontend (`npm install`, `npm run dev`). Connect it to backend through `frontend/.env`. Register, login, create a post from the browser. | Full flow works in browser |
| 4 | Sat 7 Nov | Test everything end to end. Fix bugs. Put your name in README, footer, and repo description. First Git push of the whole project. | No errors, code on GitHub |
| 5 | Sun 8 Nov | Deploy: MySQL on Railway (or Aiven), backend on Render, frontend on Netlify or Vercel. Set environment variables. | Live link works |
| 6 | Mon 9 Nov | Take screenshots. Finish README (live links, GitHub link). Make the PDF for Project 2. | PDF ready |
| 7 | Tue 10 Nov | Buffer day for any problem. Final check, then email both project PDFs together to support@genzeducatewing.com. | Email sent |

Note: Project 1 (quiz app) also needs to be finished and included in the same email. Use Days 5 to 7 buffer or start it in parallel from Day 4.
