export default function StatCard({ label, value, hint }) {
  return (
    <div className="stat-card">
      <p className="stat-label mb-1">{label}</p>
      <p className="stat-value mb-0">{value}</p>
      {hint && <p className="stat-hint mb-0">{hint}</p>}
    </div>
  );
}
