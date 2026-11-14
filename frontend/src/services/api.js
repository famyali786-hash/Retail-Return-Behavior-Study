const BASE_URL = import.meta.env.VITE_API_URL || "https://retail-return-behavior-study-production.up.railway.app";

export async function fetchMeta() {
  const res = await fetch(`${BASE_URL}/meta`);
  if (!res.ok) throw new Error("Failed to load filter options");
  return res.json();
}

export async function fetchDashboardData({ country = "all", year = "all", months = [] } = {}) {
  const params = new URLSearchParams();
  params.append("country", country);
  params.append("year", year);
  months.forEach((m) => params.append("month", m));

  const res = await fetch(`${BASE_URL}/dashboard-data?${params}`);
  if (!res.ok) throw new Error("Failed to load dashboard data");
  return res.json();
}
