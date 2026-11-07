# Blogging Platform

**Author: Chayan Choudhury**

A simple full-stack blogging platform where users can register, log in, write and edit blog posts, read other users' posts, and comment on them.

- **Frontend:** React (Vite) + React Router
- **Backend:** Node.js + Express (REST API)
- **Database:** MySQL
- **Auth:** JWT tokens, passwords hashed with bcrypt

## Features

- Register and login
- Create, edit and delete your own posts
- View all posts and read any single post
- Add comments on posts, delete your own comments

## Project Structure

```
blog-platform/
├── backend/
│   ├── server.js
│   ├── db.js
│   ├── schema.sql
│   ├── middleware/auth.js
│   └── routes/ (auth.js, posts.js, comments.js)
└── frontend/
    └── src/ (App.jsx, api.js, AuthContext.jsx, pages/)
```

## Setup (Local)

**Requirements:** Node.js 18+, MySQL 8+, Git

### 1. Database
Open MySQL and run the schema file:
```
mysql -u root -p < backend/schema.sql
```
This creates the `blog_db` database with `users`, `posts` and `comments` tables.

### 2. Backend
```
cd backend
npm install
cp .env.example .env     # then edit .env: set DB_PASSWORD and JWT_SECRET
npm start
```
Backend runs on http://localhost:5000

### 3. Frontend
```
cd frontend
npm install
cp .env.example .env
npm run dev
```
Frontend runs on http://localhost:5173

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | No | Create account |
| POST | /api/auth/login | No | Login, returns token |
| GET | /api/posts | No | List all posts |
| GET | /api/posts/:id | No | Get one post with comments |
| POST | /api/posts | Yes | Create post |
| PUT | /api/posts/:id | Yes (owner) | Edit post |
| DELETE | /api/posts/:id | Yes (owner) | Delete post |
| POST | /api/posts/:id/comments | Yes | Add comment |
| DELETE | /api/comments/:id | Yes (owner) | Delete comment |

Protected routes need the header `Authorization: Bearer <token>`.

## Security Measures

- Passwords hashed with bcrypt (never stored in plain text)
- JWT authentication with 7-day expiry
- Owner checks: only the author can edit or delete their post or comment
- Parameterized SQL queries (prevents SQL injection)
- React escapes post and comment text (prevents XSS)
- Helmet secure headers, CORS limited to the frontend URL, request size limit
- Rate limiting on login and register (prevents brute force)
- Secrets kept in `.env` (not committed to Git)

## Deployment

- **Database:** Railway or Aiven (MySQL). Run `schema.sql` on it.
- **Backend:** Render (Web Service, root directory `backend`, build `npm install`, start `npm start`). Set environment variables: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_SSL=true`, `JWT_SECRET`, `CLIENT_URL` (your frontend URL).
- **Frontend:** Netlify or Vercel (root directory `frontend`, build `npm run build`, output `dist`). Set `VITE_API_URL` to your backend URL plus `/api`. Add a redirect rule so all routes serve `index.html` (Netlify: file `frontend/public/_redirects` containing `/* /index.html 200`).

## Live Links

- Live website: https://dazzling-caramel-c77ff2.netlify.app
- Backend API: https://blog-platform-w6os.onrender.com
- GitHub repository: https://github.com/Chayan-IND/blog-platform

Note: The backend runs on a free plan, so the first request after a break can take up to a minute.
