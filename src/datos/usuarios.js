// Usuarios de prueba: uno por rol.
// Las contraseñas están en texto plano SOLO porque es una simulación
// del Sprint 1. En un sistema real se guardan encriptadas en el servidor.
export const USUARIOS_INICIALES = [
  { id: 1, dni: "30111111", contrasena: "paciente123", nombre: "Juana", apellido: "Martínez", email: "paciente@bala.com", rol: "paciente" },
  { id: 2, dni: "30222222", contrasena: "medico123", nombre: "Martín", apellido: "Ibarra", email: "medico@bala.com", rol: "medico" },
  { id: 3, dni: "30333333", contrasena: "enfermera123", nombre: "Lucía", apellido: "Torres", email: "enfermera@bala.com", rol: "enfermera" },
  { id: 4, dni: "30444444", contrasena: "admin123", nombre: "Carolina", apellido: "Ruiz", email: "admin@bala.com", rol: "administrativo" },
  { id: 5, dni: "30555555", contrasena: "directivo123", nombre: "Roberto", apellido: "Salas", email: "directivo@bala.com", rol: "directivos" },
];
