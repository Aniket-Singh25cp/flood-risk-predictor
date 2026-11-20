# Frontend (React + Vite)

Owner: Aviral. The app is **not generated yet** (the starter kit was built without internet access). Create it once:

```
# from the repository root
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install leaflet react-leaflet recharts
npm run dev          # http://localhost:5173
```
(If it asks to overwrite the folder because it has this README, answer "Ignore files and continue".)
Then commit `package.json` and `package-lock.json` (CI uses `npm ci`, which needs the lock file).

Read the API address from `import.meta.env.VITE_API_URL` (see `.env.example`). Build against `/risk-map` and `/predict`
first: they already work with mock data. Always show a text label next to every risk colour, and show the disclaimer
"Decision-support estimate. Not an official flood warning." on result screens.
