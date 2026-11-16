import { useState, useEffect, useCallback } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";
import KPICard from "../components/KPICard";
import LoadingSpinner from "../components/LoadingSpinner";
import PowerBIModal from "../components/PowerBIModal";
import { fetchDashboardData, fetchMeta } from "../services/api";
import Select from "react-select";
import "./Dashboard.css";

const MONTHS = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const PIE_COLORS = ["#f85149", "#2ea043"];

export default function Dashboard() {
  const [meta, setMeta] = useState({ countries: [], years: [], months: [] });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPBI, setShowPBI] = useState(false);

  // filter states
  const [country, setCountry] = useState("all");
  const [year, setYear] = useState("all");
  const [months, setMonths] = useState([]);

  // load filter options on mount
  useEffect(() => {
    fetchMeta().then(setMeta).catch(() => {});
  }, []);

  // load dashboard data when filters change
  const loadData = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchDashboardData({ country, year, months })
      .then((d) => { setData(d); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, [country, year, months]);

  useEffect(() => { loadData(); }, [loadData]);

  const resetFilters = () => {
    setCountry("all");
    setYear("all");
    setMonths([]);
  };

  const kpis = data?.kpis || {};

  // helper to calc pie percentage
  const getPiePercent = (value, pieData) => {
    const total = pieData.reduce((sum, item) => sum + item.value, 0);
    return total ? ((value / total) * 100).toFixed(1) : "0.0";
  };

  return (
    <div>
      <PowerBIModal isOpen={showPBI} onClose={() => setShowPBI(false)} />

      {/* Header */}
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1>📊 Retail Return Behaviour Dashboard</h1>
            <p>Overview with dynamic filtering</p>
          </div>
          <button className="powerbi-btn" onClick={() => setShowPBI(true)}>
            <span className="powerbi-btn-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="1" y="10" width="4" height="13" rx="1" fill="#F2C811" />
                <rect x="7" y="6" width="4" height="17" rx="1" fill="#F2C811" opacity="0.85" />
                <rect x="13" y="2" width="4" height="21" rx="1" fill="#F2C811" opacity="0.7" />
                <rect x="19" y="6" width="4" height="17" rx="1" fill="#F2C811" opacity="0.55" />
              </svg>
            </span>
            View in Power BI
            <span className="powerbi-btn-arrow">↗</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="filter-group">
          <label>Country</label>
          <select value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="all">All Countries</option>
            {meta.countries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Year</label>
          <select value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="all">All Years</option>
            {meta.years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Month</label>
          <Select
            isMulti
            options={MONTHS.slice(1).map((name, i) => ({ value: i + 1, label: name }))}
            value={months.map((m) => ({ value: m, label: MONTHS[m] }))}
            onChange={(sel) => setMonths(sel ? sel.map((s) => s.value) : [])}
            placeholder="Select months..."
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>

        <button className="filter-reset-btn" onClick={resetFilters}>
          ↺ Reset
        </button>
      </div>

      {/* Error message */}
      {error && <div className="error-banner">⚠️ {error}</div>}

      {/* KPI Cards */}
      <div className="kpi-grid">
        <KPICard
          icon="🛒" label="Total Orders"
          value={loading ? "—" : (kpis.totalOrders || 0).toLocaleString()}
          sub="All transactions in period"
          accentColor="#4f8ef7" iconBg="rgba(79,142,247,0.12)"
        />
        <KPICard
          icon="↩️" label="Total Returns"
          value={loading ? "—" : (kpis.totalReturns || 0).toLocaleString()}
          sub="Returned transactions"
          accentColor="#f85149" iconBg="rgba(248,81,73,0.12)"
        />
        <KPICard
          icon="📈" label="Return Rate"
          value={loading ? "—" : `${kpis.returnRate || 0}%`}
          sub="Returns / Total orders"
          accentColor="#e3b341" iconBg="rgba(227,179,65,0.12)"
        />
        <KPICard
          icon="💰" label="Net Revenue"
          value={loading ? "—" : `£${(kpis.netRevenue || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          sub="Revenue from non-returned orders"
          accentColor="#2ea043" iconBg="rgba(46,160,67,0.12)"
        />
      </div>

      {/* Charts */}
      {loading ? (
        <LoadingSpinner message="Loading chart data..." />
      ) : data ? (
        <>
          <div className="charts-grid">
            {/* Line Chart - Monthly Trend */}
            <div className="chart-card">
              <h3>📉 Monthly Return Trend</h3>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={data.monthlyTrend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                  <XAxis
                    dataKey="month"
                    tickFormatter={(m) => MONTHS[m] || m}
                    stroke="#484f58"
                    tick={{ fill: "#8b949e", fontSize: 12 }}
                  />
                  <YAxis stroke="#484f58" tick={{ fill: "#8b949e", fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="orders" name="Orders" stroke="#4f8ef7" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="returns" name="Returns" stroke="#f85149" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart - Return vs Non-Return */}
            <div className="chart-card">
              <h3>🥧 Return vs Non-Return</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={data.returnPie}
                    cx="50%" cy="50%"
                    innerRadius={70} outerRadius={110}
                    paddingAngle={3}
                    dataKey="value"
                    label={false}
                  >
                    {data.returnPie.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => v.toLocaleString()} />
                </PieChart>
              </ResponsiveContainer>

              {/* Pie legend */}
              <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 8 }}>
                {data.returnPie.map((entry, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#c9d1d9" }}>
                    <span style={{ width: 12, height: 12, borderRadius: "50%", background: PIE_COLORS[i], display: "inline-block" }} />
                    <span>{entry.name}</span>
                    <span style={{ color: PIE_COLORS[i], fontWeight: 600 }}>
                      {getPiePercent(entry.value, data.returnPie)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bar Chart - Returns by Country */}
          <div className="chart-card">
            <h3>🌍 Returns by Country (Top 10)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.countryBar} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                <XAxis
                  dataKey="country" stroke="#484f58"
                  tick={{ fill: "#8b949e", fontSize: 11 }}
                  angle={-35} textAnchor="end" interval={0}
                />
                <YAxis stroke="#484f58" tick={{ fill: "#8b949e", fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="returns" name="Returns" fill="#f85149" radius={[4, 4, 0, 0]} />
                <Bar dataKey="orders" name="Orders" fill="#4f8ef7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : null}
    </div>
  );
}
