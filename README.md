# MERN Stack Developer Portfolio

A full-stack developer portfolio built with the **MERN stack** — MongoDB, Express.js, React, and Node.js. It showcases my profile, technical skills, projects, education, activities, and contact information, with a private admin dashboard for managing projects and contact messages.

**Live Demo:** [View Portfolio](https://soumyajeet-portfolioo.netlify.app)  
**Backend API:** [Portfolio API](https://soumyajeet-portfolio-api.onrender.com/api/health)  
**GitHub:** [Soumyajeet44](https://github.com/Soumyajeet44)  
**LinkedIn:** [Connect with me](https://www.linkedin.com/in/soumya06)

---

## Features

- **Responsive UI:** About, Skills, Projects, Education, Activities, and Contact sections.
- **Dark and Light Themes:** Theme preference persists using local storage.
- **Dynamic Projects:** Projects load from MongoDB, with frontend fallback content.
- **Contact Form:** Stores messages in MongoDB with validation, a honeypot, and rate limiting.
- **Private Admin Dashboard:** Manage projects and contact messages after authentication.
- **Secure Authentication:** Password hashing with bcrypt, JWT authentication, and HTTP-only cookies.
- **API Protection:** Helmet security headers, CORS allow-list, request size limits, and API rate limits.
- **No Public Registration:** Administrator accounts are provisioned through the backend.

## Tech Stack

| Area | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript, CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcrypt, HTTP-only cookies |
| Security | Helmet, CORS, rate limiting |
| Deployment | Netlify (frontend), Render (backend) |

## Project Structure

```text
Portfolio/
├── frontend/
│   ├── public/
│   │   ├── images/
│   │   └── resume.pdf
│   └── src/
└── portfolio-backend/
    ├── middleware/
    ├── models/
    ├── routes/
    └── scripts/
        └── createAdmin.js
```

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm
- MongoDB Atlas or a local MongoDB instance

### 1. Clone the repository

```bash
git clone https://github.com/Soumyajeet44/Portfolio.git
cd Portfolio
```

### 2. Configure the backend

```bash
cd portfolio-backend
npm install
```

Copy `.env.example` to `.env` and configure the required environment variables:

- `MONGO_URI` — MongoDB connection string.
- `JWT_SECRET` — A strong, randomly generated secret of at least 32 characters.
- `ADMIN_NAME` — Administrator's name.
- `ADMIN_EMAIL` — Administrator's email.
- `ADMIN_PASSWORD` — A unique administrator password of at least 12 characters.
- `CLIENT_ORIGINS` — The permitted frontend origin, such as `http://localhost:5173`.

Generate a random JWT secret using Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Create or update the administrator account:

```bash
npm run create-admin
```

Start the backend API:

```bash
npm run dev
```

The API runs at `http://localhost:5000` by default.

Health check: `http://localhost:5000/api/health`

### 3. Configure the frontend

Open a second terminal:

```bash
cd frontend
npm install
```

Create `frontend/.env` if you need to specify a custom API URL:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### 4. Access the Admin Dashboard

Visit `http://localhost:5173/admin` and sign in using the administrator account provisioned through the backend.

The dashboard supports project management and contact inbox management. Public visitors can view the portfolio without logging in.

**Security:** Never place admin credentials, database credentials, or JWT secrets in frontend environment variables.

## Deployment

The project uses the following deployment setup:

- **Frontend:** Netlify
- **Backend:** Render
- **Database:** MongoDB Atlas

For deployment:

1. Deploy `portfolio-backend` to a Node.js-compatible hosting provider.
2. Configure the backend environment variables in the hosting dashboard.
3. Set `NODE_ENV=production` and configure `CLIENT_ORIGINS` to the exact deployed frontend origin.
4. Deploy `frontend` using `npm run build` and publish the `dist` directory.
5. Set `VITE_API_URL` to the deployed API base URL and rebuild the frontend.
6. Enable HTTPS and verify that credentialed requests and cookie settings work correctly.
7. Provision the administrator account using the backend's `npm run create-admin` script in the appropriate deployment environment.

Never commit `.env` files or production secrets to GitHub.

## Security Considerations

- Environment files and `node_modules` should remain excluded from version control.
- Public account registration is intentionally disabled.
- Test authentication, logout, project CRUD, contact submissions, and API health after deployment.
- If a credential or secret has ever been exposed, rotate it. Removing it from the current code alone does not invalidate it.

## Related Projects

- [CertiFlow](https://github.com/Soumyajeet44/certiflow)
- [GitHub Profile](https://github.com/Soumyajeet44)
- [LinkedIn Profile](https://www.linkedin.com/in/soumya06)

---

*Built to showcase my full-stack development skills and practical experience with the MERN stack.*
