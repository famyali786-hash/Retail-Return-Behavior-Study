// Use environment variable or fallback to production URL
const BASE_URL = import.meta.env.VITE_API_URL || "https://retail-return-behavior-study-production.up.railway.app";

export async function fetchMeta() {
  try {
    const res = await fetch(`${BASE_URL}/meta`);
    if (!res.ok) throw new Error(`Failed to fetch filter options: ${res.status} ${res.statusText}`);
    return res.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
/**
 * Fetch dashboard data.
 * @param {string} country
 * @param {string|number} year
 * @param {number[]} months - array of month numbers
 */
export async function fetchDashboardData({ country = "all", year = "all", months = [] } = {}) {
  try {
    const params = new URLSearchParams();
    params.append("country", country);
    params.append("year", year);
    months.forEach((m) => params.append("month", m));

    const res = await fetch(`${BASE_URL}/dashboard-data?${params.toString()}`);
    if (!res.ok) throw new Error(`Failed to fetch dashboard data: ${res.status} ${res.statusText}`);
    return res.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}