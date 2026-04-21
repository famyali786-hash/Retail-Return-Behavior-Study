import { useState, useEffect, useCallback } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";
import KPICard from "../components/KPICard";
import LoadingSpinner from "../components/LoadingSpinner";
import PowerBIModal from "../components/PowerBIModal";
import { fetchDashboardData, fetchMeta } from "../services/api";
import Select from "react-select";
import "./Dashboard.css";

const MONTH_NAMES = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const PIE_COLORS = ["#f85149", "#2ea043"];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#1e2530",
      border: "1px solid #30363d",
      borderRadius: 8,
      padding: "10px 14px",
      fontSize: 13,
    }}>
      <p style={{ color: "#8b949e", marginBottom: 4 }}>{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color, margin: "2px 0" }}>
          {p.name}: <strong>{typeof p.value === "number" ? p.value.toLocaleString() : p.value}</strong>
        </p>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [meta, setMeta] = useState({ countries: [], years: [], months: [] });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPBI, setShowPBI] = useState(false);

  const [country, setCountry] = useState("all");
  const [year, setYear] = useState("all");
  const [months, setMonths] = useState([]);

  // Load filter options
  useEffect(() => {
    fetchMeta()
      .then(setMeta)
      .catch(() => { }); // non-fatal
  }, []);

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

  const kpis = data?.kpis ?? {};

  return (
    <div>
      <PowerBIModal isOpen={showPBI} onClose={() => setShowPBI(false)} />
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1>📊 Retail Return Behaviour Dashboard</h1>
            <p>Retail Return Behaviour Overview With Dynamic Filtering</p>
          </div>
          <button
            id="powerbi-link-btn"
            className="powerbi-btn"
            onClick={() => setShowPBI(true)}
          >
            <span className="powerbi-btn-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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

      <div className="filters-bar">
       
        <div className="filter-group">
          <label htmlFor="filter-country">Country</label>
          <select
            id="filter-country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option value="all">All Countries</option>
            {meta.countries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filter-year">Year</label>
          <select
            id="filter-year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="all">All Years</option>
            {meta.years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filter-month">Month</label>

          <Select
            isMulti
            options={MONTH_NAMES.slice(1).map((name, i) => ({
              value: i + 1,
              label: name
            }))}
            value={months.map((m) => ({
              value: m,
              label: MONTH_NAMES[m]
            }))}
            onChange={(selected) => {
              setMonths(selected ? selected.map((s) => s.value) : []);
            }}
            placeholder="Select months..."
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>

        <button className="filter-reset-btn" onClick={resetFilters}>
          ↺ Reset
        </button>
      </div>

      {error && (
        <div className="error-banner">⚠️ {error}</div>
      )}

      <div className="kpi-grid">
        <KPICard
          icon="🛒"
          label="Total Orders"
          value={loading ? "—" : (kpis.totalOrders ?? 0).toLocaleString()}
          sub="All transactions in period"
          accentColor="#4f8ef7"
          iconBg="rgba(79,142,247,0.12)"
        />
        <KPICard
          icon="↩️"
          label="Total Returns"
          value={loading ? "—" : (kpis.totalReturns ?? 0).toLocaleString()}
          sub="Returned transactions"
          accentColor="#f85149"
          iconBg="rgba(248,81,73,0.12)"
        />
        <KPICard
          icon="📈"
          label="Return Rate"
          value={loading ? "—" : `${kpis.returnRate ?? 0}%`}
          sub="Returns / Total orders"
          accentColor="#e3b341"
          iconBg="rgba(227,179,65,0.12)"
        />
        <KPICard
          icon="💰"
          label="Net Revenue"
          value={loading ? "—" : `£${(kpis.netRevenue ?? 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          sub="Revenue from non-returned orders"
          accentColor="#2ea043"
          iconBg="rgba(46,160,67,0.12)"
        />
      </div>

      {loading ? (
        <LoadingSpinner message="Loading chart data..." />
      ) : data ? (
        <>
          {/* Row 1: Line Chart + Pie Chart */}
          <div className="charts-grid">
 
            <div className="chart-card">
              <h3>📉 Monthly Return Trend</h3>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={data.monthlyTrend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                  <XAxis
                    dataKey="month"
                    tickFormatter={(m) => MONTH_NAMES[m] || m}
                    stroke="#484f58"
                    tick={{ fill: "#8b949e", fontSize: 12 }}
                  />
                  <YAxis stroke="#484f58" tick={{ fill: "#8b949e", fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, color: "#8b949e" }} />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    name="Orders"
                    stroke="#4f8ef7"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="returns"
                    name="Returns"
                    stroke="#f85149"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h3>🥧 Return vs Non-Return</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={data.returnPie}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(1)}%`
                    }
                    labelLine={{ stroke: "#484f58" }}
                  >
                    {data.returnPie.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => v.toLocaleString()}
                    contentStyle={{ background: "#1e2530", border: "1px solid #30363d", borderRadius: 8 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-card">
            <h3>🌍 Returns by Country (Top 10)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={data.countryBar}
                margin={{ top: 5, right: 20, left: 0, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                <XAxis
                  dataKey="country"
                  stroke="#484f58"
                  tick={{ fill: "#8b949e", fontSize: 11 }}
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis stroke="#484f58" tick={{ fill: "#8b949e", fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, color: "#8b949e", paddingTop: 8 }} />
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