export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="page-header d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
      <div>
        <h1 className="page-title mb-1">{title}</h1>
        {subtitle && <p className="page-subtitle mb-0">{subtitle}</p>}
      </div>
      {actions && <div className="d-flex gap-2 flex-wrap">{actions}</div>}
    </div>
  );
}
