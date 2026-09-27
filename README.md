# Lucky Business

A full-stack livestock marketplace for cows and buffaloes. Buyers can browse verified listings and contact the business directly by WhatsApp or phone. Sellers can submit a listing with a photo. The admin desk supports adding and removing listings.

## Run the frontend

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Run the backend

Prerequisites: Java 17+, Maven, and MySQL.

```powershell
cd backend
mvn spring-boot:run
```

The API runs at `http://localhost:8080`. Configure `DB_HOST`, `DB_USER`, `DB_PASSWORD`, and `ADMIN_KEY` as environment variables when needed. Uploaded images are stored in `backend/uploads` by default.

The frontend deliberately includes demo listings and falls back to local demo mode when the backend is offline, so the interface can be reviewed before database setup.

## API

- `GET /api/livestock?search=&type=&minMilk=&minPrice=&maxPrice=`
- `POST /api/livestock/upload` multipart form with `image` and listing fields
- `PUT /api/livestock/{id}` with `X-Admin-Key`
- `DELETE /api/livestock/{id}` with `X-Admin-Key`

SQL setup lives in `database/schema.sql` and `database/sample-data.sql`. The WhatsApp number is configured in `frontend/src/App.jsx` and is currently `+91 8839715938`.
