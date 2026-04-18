![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Jupyter](https://img.shields.io/badge/Jupyter-F37626?style=for-the-badge&logo=jupyter&logoColor=white)
![Pandas](https://img.shields.io/badge/Pandas-150458?style=for-the-badge&logo=pandas&logoColor=white)
![NumPy](https://img.shields.io/badge/NumPy-013243?style=for-the-badge&logo=numpy&logoColor=white)
![SciPy](https://img.shields.io/badge/SciPy-8CAAE6?style=for-the-badge&logo=scipy&logoColor=white)
![Matplotlib](https://img.shields.io/badge/Matplotlib-11557C?style=for-the-badge)
![Seaborn](https://img.shields.io/badge/Seaborn-2E8B57?style=for-the-badge)
![Power%20BI](https://img.shields.io/badge/Power%20BI-F2C811?style=for-the-badge&logo=powerbi&logoColor=black)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)

# 📊 Retail Return Behaviour Analysis Dashboard

## 📁 Data Analytics + Full-Stack Dashboard Project

A full-stack data analytics dashboard that analyzes retail return behavior to uncover patterns, trends, and key insights. The project integrates a Flask backend, React frontend, and Power BI visualizations to deliver an interactive and user-friendly analytics experience.

This project was developed as part of an On-the-Job Training (OJT) program to understand real-world data analysis, dashboard building, and full-stack integration.

## 🚀 Features
1. KPI Dashboard

Displays key business metrics:

📦 Total Orders

🔁 Total Returns

📉 Return Rate (%)

💰 Revenue Impact

These KPIs update dynamically based on filters.

2. Interactive Filters

Users can filter data based on:

🌍 Country

📅 Year

🗓️ Month

This enables focused analysis and better decision-making.

3. Power BI Integration

Embedded Power BI dashboard for advanced visual insights:

📊 Sales vs Returns Trends

📦 Category-wise Return Analysis

🌎 Region-wise Performance

Provides rich, interactive visualizations inside the app.

4. Dynamic Charts (Frontend)

Custom charts built using React:

📈 Monthly Return Trends

📊 Category Distribution

📉 Return Percentage Analysis

5. Flask Backend API

Handles all data processing and API endpoints:

/meta → Filter values (Country, Year, Month)

/dashboard-data → KPI + chart data

Ensures smooth communication between frontend and dataset.

6. Clean UI with Loading States

✔ Responsive design

⏳ Loading spinner for better UX

🎯 Modular components (KPI cards, charts, modal)

## 📸 Screenshots

Dashboard Overview

(Add screenshot here)

Power BI Modal

![Power BI](frontend/src/assets/powerbi.png)

KPI Cards

(Add screenshot here)

## 🗂️ Project Structure

```

RETAIL-RETURN-BEHAVIOR-ANALYSIS/
│
├── backend/
│   ├── app.py              # Flask backend
│   ├── model.pkl
|   ├── requirements.txt
|   ├── train_model.py
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── KpiCards.jsx
│   │   │   └── LoadingSpinner.jsx
            └── PowerBIModal.css
│   │   │   └── PowerBIModal.jsx
│   │   │
│   │   ├── pages/
│   │   │   └── Dashboard.jsx
            └── Dashboard.css
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── index.html
│   └── package.json
│
├── README.md
└── requirements.txt
```

## 🛠️ Tech Stack

### Backend

Python

Flask

Pandas

### Frontend

React.js

CSS

### Data Visualization

Power BI

## ▶️ How to Run the Project

1. Clone the Repository
```
git clone https://github.com/Vaishnavi10706/Retail-Return-Behavior-Study.git
cd retail-return-behavior-analysis
```
2. Setup Backend
```
cd backend
pip install -r requirements.txt
python app.py
```
3. Setup Frontend
```
cd frontend
npm install
npm run dev
```
## 🧭 How to Use

Step 1: Open Dashboard
Run frontend and open in browser

Step 2: Apply Filters

Select:

Country

Year

Month

Step 3: Analyze KPIs

View updated:

Total Orders

Returns

Return Rate

Step 4: Explore Visuals

View charts

Open Power BI modal for deeper insights

## 📌 Example Insights

✔ High return rate in specific categories

✔ Seasonal trends in returns

✔ Country-wise return differences

✔ Revenue loss due to returns

## 🎯 Purpose of the Project

This project helps in understanding:

1. Real-world retail analytics
2. Return behavior patterns
3. Full-stack dashboard development
4. API integration between React & Flask
5. Embedding Power BI in applications
6. Data-driven decision making

## 🌱 Future Improvements

- User authentication  
- Export reports (PDF/CSV)  
- Advanced filters  
- Real-time data updates  
- Machine learning for return prediction  

## ⭐ Support

If you found this project useful, consider starring ⭐ the repository!

## 👩‍💻 Author

**Vaishnavi**  
B.Tech Student – Data Analytics  

🔗 GitHub: https://github.com/Vaishnavi10706
