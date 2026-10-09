# Soumyajeet Mahanta — MERN Portfolio

A responsive developer portfolio built with **React + Vite**, **Node.js + Express**, and **MongoDB + Mongoose**. It includes a public profile/projects/contact page, dark/light theme, and a private admin dashboard for project CRUD and contact inbox management.

## Features

- Responsive portfolio with About, Skills, Projects, Education, Activities and Contact sections.
- Dark/light mode persisted in local storage.
- Projects loaded from MongoDB with starter project highlights as a graceful frontend fallback.
- Contact form writes messages to MongoDB; validation, honeypot and rate limit included.
- Admin login only: there is no public registration endpoint.
- Passwords hashed with bcrypt; JWT stored in an HTTP-only cookie; protected project and inbox routes.
- Admin dashboard supports create, read, update and delete projects and delete contact messages.
- Helmet security headers, CORS allow-list, request size limits and API rate limits.

## Folder structure

```text
Portfolio/
├── frontend/                  # React + Vite application
│   ├── public/images/         # Profile image placeholder
│   ├── public/resume.pdf      # Resume download
│   └── src/                   # Pages, API client, styles
└── portfolio-backend/         # Express + MongoDB API
    ├── middleware/            # Admin authorization
    ├── models/                # User, Project, Contact
    ├── routes/                # Auth, projects, contact
    └── scripts/createAdmin.js # Create/update the private admin account
```

## Requirements

- Node.js 20 or newer
- npm
- MongoDB Atlas database or a local MongoDB instance

## 1. Configure the backend

```bash
cd portfolio-backend
npm install
```

Copy `.env.example` to `.env` and set your values:

- `MONGO_URI`: MongoDB connection string; ensure your Atlas network access and database user are configured.
- `JWT_SECRET`: a random secret at least 32 characters long. Generate one with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`.
- `ADMIN_EMAIL`, `ADMIN_NAME`, `ADMIN_PASSWORD`: the private administrator's credentials. Use a unique password of at least 12 characters.
- `CLIENT_ORIGINS`: `http://localhost:5173` for local development. In production, set this to your exact deployed frontend origin.

Create the admin account (or reset its password):

```bash
npm run create-admin
```

Start the API:

```bash
npm run dev
```

API health check: `http://localhost:5000/api/health`.

## 2. Start the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The API defaults to `http://localhost:5000/api`. To use another API URL, create `frontend/.env` with:

```env
VITE_API_URL=http://localhost:5000/api
```

## 3. Use the admin dashboard

Visit `http://localhost:5173/admin` and sign in with the account created by `npm run create-admin`. Add and manage projects in the dashboard. The public portfolio remains viewable without login. Never add admin credentials or JWT secrets to frontend environment variables.

## 4. Add your actual profile photo and verify personal details

Replace `frontend/public/images/profile-placeholder.jpg` with a square or portrait photo of yourself and update the image filename in `frontend/src/App.jsx` if needed. The current image is an illustration placeholder, not a real photograph. Review `profile` in `frontend/src/App.jsx` and confirm your public email, phone/location, college, CGPA, and graduation dates before deployment. The phone number is intentionally not displayed on the public page by default.

The bundled `frontend/public/resume.pdf` is a resume copy. Replace it whenever you update your resume.

## 5. Deploy

1. Deploy the API from `portfolio-backend` to a Node-compatible host.
2. Set the backend environment variables in the host dashboard; do not upload `.env`.
3. Set `NODE_ENV=production`, a strong `JWT_SECRET`, `MONGO_URI`, `ADMIN_*`, and `CLIENT_ORIGINS` to the exact frontend URL.
4. Deploy `frontend` to a static host using `npm run build` (publish the `dist` directory).
5. Set `VITE_API_URL` to the deployed API base URL and rebuild the frontend.
6. Ensure HTTPS is enabled on both frontend and API. Because the admin cookie is HTTP-only, frontend requests use `credentials: 'include'` and the API CORS origin must match exactly.
7. Run `npm run create-admin` in the backend deployment environment once to provision the admin account.

## Security notes

- `.env` files and `node_modules` are excluded from the source archive. Keep secrets out of GitHub.
- This app intentionally does not allow public account creation or user roles other than admin.
- Rotate any database password or API secret that was ever committed or shared. Removing a secret from a working copy does not revoke it.
- Before public launch, test login/logout, project CRUD, contact submissions, and the health endpoint against your own configured MongoDB instance.

## Project links

- GitHub profile: https://github.com/Soumyajeet44
- LinkedIn: https://www.linkedin.com/in/soumya06
- CertiFlow repository: https://github.com/Soumyajeet44/certiflow
