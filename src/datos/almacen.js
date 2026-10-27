// ÚNICO lugar del proyecto que toca localStorage.
// Si más adelante se hace la API, se cambia solo este archivo
// y las pantallas no se enteran.

// Lee una lista (o valor) guardado. Si no existe todavía, guarda y devuelve el valor inicial.
export function leer(clave, valorInicial) {
  try {
    const guardado = localStorage.getItem(clave);
    if (guardado === null) {
      localStorage.setItem(clave, JSON.stringify(valorInicial));
      return valorInicial;
    }
    return JSON.parse(guardado);
  } catch {
    return valorInicial;
  }
}

export function guardar(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    // si el navegador bloquea el almacenamiento, la app sigue funcionando sin persistir
  }
}

// ID único para un registro nuevo: el mayor que haya + 1
export function siguienteId(lista) {
  return lista.length ? Math.max(...lista.map((item) => item.id)) + 1 : 1;
}
