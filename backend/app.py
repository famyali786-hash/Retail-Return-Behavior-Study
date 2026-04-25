import json
import os
from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app, origins=[
    "http://localhost:5173", 
    "http://localhost:4173", 
    "https://retail-return-behavior-study.vercel.app",
    "https://*.vercel.app"
], supports_credentials=True)

BASE_DIR = os.path.dirname(__file__)

DATA_PATH = os.path.join(BASE_DIR, "..", "data.json")
print("Loading dataset...")
with open(DATA_PATH, "r", encoding="utf-8") as f:
    raw_data = json.load(f)

df_full = pd.DataFrame(raw_data)
print("Dataset loaded: {:,} rows".format(len(df_full)))

@app.route("/")
def home():
    return "Backend is running 🚀"

def apply_filters(df, country, year, months):
    filtered = df.copy()
    if country and country.lower() != "all":
        filtered = filtered[filtered["Country"] == country]
    if year and str(year).lower() != "all":
        filtered = filtered[filtered["Year"] == int(year)]
    if months:
        month_ints = [int(m) for m in months]
        filtered = filtered[filtered["Month"].isin(month_ints)]
    return filtered


@app.route("/meta", methods=["GET"])
def get_meta():
    countries = sorted(df_full["Country"].unique().tolist())
    years     = sorted(df_full["Year"].unique().tolist())
    months    = sorted(df_full["Month"].unique().tolist())
    return jsonify({
        "countries": countries,
        "years":     [int(y) for y in years],
        "months":    [int(m) for m in months],
    })


@app.route("/dashboard-data", methods=["GET"])
def dashboard_data():
    country = request.args.get("country", "all")
    year    = request.args.get("year",    "all")
    months  = request.args.getlist("month")   # ?month=1&month=2 ...

    df = apply_filters(df_full, country, year, months)

    total_orders  = int(len(df))
    total_returns = int(df["Return"].sum())
    return_rate   = round(total_returns / total_orders * 100, 2) if total_orders else 0.0
    net_revenue   = round(float(df[df["Return"] == 0]["TotalPrice"].sum()), 2)

    monthly = (
        df.groupby("Month")
          .agg(orders=("Return", "count"), returns=("Return", "sum"))
          .reset_index()
          .sort_values("Month")
    )
    monthly_trend = [
        {
            "month":      int(row["Month"]),
            "orders":     int(row["orders"]),
            "returns":    int(row["returns"]),
            "returnRate": round(row["returns"] / row["orders"] * 100, 2) if row["orders"] else 0,
        }
        for _, row in monthly.iterrows()
    ]

    return_pie = [
        {"name": "Returns",     "value": total_returns},
        {"name": "Non-Returns", "value": total_orders - total_returns},
    ]

    by_country = (
        df.groupby("Country")["Return"]
          .agg(["sum", "count"])
          .reset_index()
          .rename(columns={"sum": "returns", "count": "orders"})
          .sort_values("returns", ascending=False)
          .head(10)
    )
    country_bar = [
        {
            "country": row["Country"],
            "returns": int(row["returns"]),
            "orders":  int(row["orders"]),
        }
        for _, row in by_country.iterrows()
    ]

    return jsonify({
        "kpis": {
            "totalOrders":  total_orders,
            "totalReturns": total_returns,
            "returnRate":   return_rate,
            "netRevenue":   net_revenue,
        },
        "monthlyTrend": monthly_trend,
        "returnPie":    return_pie,
        "countryBar":   country_bar,
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)
