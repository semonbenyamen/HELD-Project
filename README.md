# HELD REAL ESTATE — MVC + React CSS Modules

Full-stack real-estate website + lightweight CRM.

## Project structure

```text
EstateFlow-Pro-MVC/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── app.js
│   │   ├── server.js
│   │   └── seed.js
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── services/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── global.css
    ├── .env.example
    └── package.json
```

## Backend architecture

The backend follows MVC conventions:

- `models/` = MongoDB data models
- `controllers/` = business logic
- `routes/` = API endpoints
- `middleware/` = auth, permissions, errors
- `config/` = database config
- `utils/` = reusable helpers

## Frontend architecture

React + Vite with CSS Modules.

Each main component/page has its own:

- `Component.jsx`
- `Component.module.css`

Only reset, typography variables, base utilities and shared form/button primitives live in `global.css`.

## Main features

### Public website
- Property catalog
- Search and filters
- Property details
- Inquiry form
- Viewing request
- WhatsApp CTA
- Responsive UI

### CRM
- Admin login
- Sales agent login
- Admin creates/activates/deactivates sales agents
- Admin assigns leads to sales agents
- Agents only see their assigned leads
- Lead pipeline
- Notes timeline
- Follow-up scheduling
- Follow-up status tracking
- Property management
- Viewing management
- KPI dashboard

## Demo accounts

After running `npm run seed` inside `backend`:

Admin:
- admin@estateflow.com
- Admin@123456

Agents:
- mariam@estateflow.com
- Agent@123456

- ahmed@estateflow.com
- Agent@123456

## Run locally

### Backend

```bash
cd backend
npm install
copy .env.example .env
npm run seed
npm run dev
```

### Frontend

Open a second terminal:

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:5000`
Health check: `http://localhost:5000/api/health`
"# HELD-Project" 
