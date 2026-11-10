const ESTADO_CLASSES = {
  Asignada: "badge-estado badge-success",
  Registrada: "badge-estado badge-info",
  "En espera": "badge-estado badge-warning",
  "En atención": "badge-estado badge-info",
  Vencido: "badge-estado badge-danger",
  "Stock bajo": "badge-estado badge-warning",
  OK: "badge-estado badge-success",
  Baja: "badge-estado badge-success",
  Media: "badge-estado badge-info",
  Alta: "badge-estado badge-warning",
  Urgente: "badge-estado badge-danger",
  Pendiente: "badge-estado badge-warning",
  Confirmado: "badge-estado badge-info",
  Atendido: "badge-estado badge-success",
  Respondido: "badge-estado badge-success",
  Cancelado: "badge-estado badge-danger",
  Ausente: "badge-estado badge-muted",
  Disponible: "badge-estado badge-success",
  Ocupada: "badge-estado badge-danger",
  Mantenimiento: "badge-estado badge-muted",
  Reservada: "badge-estado badge-warning",
  Vigente: "badge-estado badge-info",
  Finalizada: "badge-estado badge-success",
  Solicitado: "badge-estado badge-warning",
  "En proceso": "badge-estado badge-info",
  Realizado: "badge-estado badge-success",
};

function EstadoBadge({ value }) {
  const cls = ESTADO_CLASSES[value] || "badge-estado badge-muted";
  return <span className={cls}>{value}</span>;
}

/**
 * columns: [{ key, label, estado?: bool }]
 * rows: [{ ...datos }]
 * renderActions: (row) => JSX  (opcional, columna final de acciones)
 */
export default function DataTable({ columns, rows, renderActions }) {
  return (
    <div className="data-table-wrapper">
      <table className="table table-hover data-table align-middle">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            {renderActions && <th className="text-end">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length + (renderActions ? 1 : 0)} className="text-center text-muted py-4">
                No hay registros para mostrar.
              </td>
            </tr>
          )}
          {rows.map((row, i) => (
            <tr key={row.id ?? i}>
              {columns.map((col) => (
                <td key={col.key}>
                  {col.estado ? <EstadoBadge value={row[col.key]} /> : row[col.key]}
                </td>
              ))}
              {renderActions && <td className="text-end">{renderActions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
