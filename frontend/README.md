# React Frontend (Vite)

This is the frontend of the Retail Return Behaviour Analysis Dashboard built using React and Vite.

## Tech Stack
- React.js
- Vite
- CSS
- Recharts (for charts)

## Features
- KPI Cards (Orders, Returns, Revenue)
- Interactive Charts
- Filters (Country, Year, Month)
- Power BI Integration Modal
- Loading Spinner for better UX

## Setup Instructions

1. Navigate to frontend folder
 ```
cd frontend
```
2. Install dependencies
```
npm install
```
3. Run the development server
```
npm run dev
```
4. Open in browser
```
http://localhost:5173
```

## Backend Connection

Make sure Flask backend is running at:
```
http://127.0.0.1:5000
```

## Folder Structure
```
src/
├── components/
├── pages/
├── services/
├── App.jsx
├── main.jsx
```

## Notes

- This frontend consumes API from Flask backend

- Data is fetched dynamically from `/dashboard-data`
