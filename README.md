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

The API runs at `http://localhost:9090` by default. Configure `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`, `ADMIN_KEY`, and `ADMIN_PASSWORD` as environment variables. `ADMIN_PHONE` is optional and defaults to `9926361994`. Uploaded images are stored in `backend/uploads` by default.

## Deploy on Vercel

Import this GitHub repository in Vercel and keep the project root at the repository root. The root `vercel.json` installs and builds the Vite app in `frontend/`, publishes `frontend/dist`, and routes client-side paths to the app.

Vercel hosts the frontend only. The Spring Boot API and MySQL database must be deployed separately. In Vercel, set `VITE_API_URL` to the public API base URL including `/api`, for example `https://your-api-host.example/api`. If omitted, the frontend uses `https://lucky-business.onrender.com/api`. Set the same API URL in Vercel's Production and Preview environments as needed.

Configure the backend host with `SPRING_DATASOURCE_URL` (for example, `jdbc:mysql://<host>:3306/lucky_business`), `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`, `ADMIN_KEY`, and `ADMIN_PASSWORD`. The backend listens on the platform-provided `PORT` or `9090` locally. Use a persistent upload store for listing photos; the local filesystem of an ephemeral app host is not durable.

The frontend deliberately includes demo listings and falls back to local demo mode when the backend is offline, so the interface can be reviewed before database setup.

## API

- `GET /api/livestock?search=&type=&minMilk=&minPrice=&maxPrice=`
- `POST /api/livestock/upload` multipart form with `image` and listing fields
- `PUT /api/livestock/{id}` with `X-Admin-Key`
- `DELETE /api/livestock/{id}` with `X-Admin-Key`

SQL setup lives in `database/schema.sql` and `database/sample-data.sql`. The WhatsApp number is configured in `frontend/src/App.jsx` and is currently `+91 8839715938`.
