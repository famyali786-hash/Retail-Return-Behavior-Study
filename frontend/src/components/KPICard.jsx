export default function KPICard({ icon, label, value, sub, accentColor, iconBg }) {
  return (
    <div
      className="kpi-card"
      style={{
        "--card-accent": accentColor,
        "--icon-bg": iconBg,
      }}
    >
      <div className="kpi-icon">{icon}</div>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
      {sub && <div className="kpi-sub">{sub}</div>}
    </div>
  );
}
