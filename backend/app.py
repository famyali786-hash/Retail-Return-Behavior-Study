import json
import os
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import pandas as pd

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "https://retail-return-behavior-study.vercel.app"}})

# Load dataset once when server starts
BASE_DIR = os.path.dirname(__file__)
DATA_PATH = os.path.join(BASE_DIR, "data.json")

with open(DATA_PATH, "r", encoding="utf-8") as f:
    raw_data = json.load(f)

df_full = pd.DataFrame(raw_data).head(50000)
print(f"Dataset loaded: {len(df_full)} rows")


@app.route("/")
def home():
    return "Backend is running"


def apply_filters(df, country, year, months):
    """Filter dataframe based on country, year, months."""
    filtered = df.copy()

    if country and country.lower() != "all":
        filtered = filtered[filtered["Country"] == country]

    if year and str(year).lower() != "all":
        filtered = filtered[filtered["Year"] == int(year)]

    if months:
        filtered = filtered[filtered["Month"].isin([int(m) for m in months])]

    return filtered


@app.route("/meta", methods=["GET"])
@cross_origin()
def get_meta():
    """Return filter dropdown values."""
    return jsonify({
        "countries": sorted(df_full["Country"].unique().tolist()),
        "years": sorted([int(y) for y in df_full["Year"].unique()]),
        "months": sorted([int(m) for m in df_full["Month"].unique()]),
    })


@app.route("/dashboard-data", methods=["GET"])
@cross_origin()
def dashboard_data():
    """Return KPIs and chart data based on selected filters."""
    country = request.args.get("country", "all")
    year = request.args.get("year", "all")
    months = request.args.getlist("month")

    df = apply_filters(df_full, country, year, months)

    # KPIs
    total_orders = len(df)
    total_returns = int(df["Return"].sum())
    return_rate = round(total_returns / total_orders * 100, 2) if total_orders else 0
    net_revenue = round(float(df[df["Return"] == 0]["TotalPrice"].sum()), 2)

    # Monthly trend
    monthly = (
        df.groupby("Month")
        .agg(orders=("Return", "count"), returns=("Return", "sum"))
        .reset_index()
        .sort_values("Month")
    )

    monthly_trend = []
    for _, row in monthly.iterrows():
        rate = round(row["returns"] / row["orders"] * 100, 2) if row["orders"] else 0
        monthly_trend.append({
            "month": int(row["Month"]),
            "orders": int(row["orders"]),
            "returns": int(row["returns"]),
            "returnRate": rate,
        })

    # Pie chart data
    return_pie = [
        {"name": "Returns", "value": total_returns},
        {"name": "Non-Returns", "value": total_orders - total_returns},
    ]

    # Country bar chart (top 10)
    by_country = (
        df.groupby("Country")["Return"]
        .agg(["sum", "count"])
        .reset_index()
        .rename(columns={"sum": "returns", "count": "orders"})
        .sort_values("returns", ascending=False)
        .head(10)
    )

    country_bar = []
    for _, row in by_country.iterrows():
        country_bar.append({
            "country": row["Country"],
            "returns": int(row["returns"]),
            "orders": int(row["orders"]),
        })

    return jsonify({
        "kpis": {
            "totalOrders": total_orders,
            "totalReturns": total_returns,
            "returnRate": return_rate,
            "netRevenue": net_revenue,
        },
        "monthlyTrend": monthly_trend,
        "returnPie": return_pie,
        "countryBar": country_bar,
    })


if __name__ == "__main__":
    app.run(debug=True, port=5000)
