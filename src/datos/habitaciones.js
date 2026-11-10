const hab = (numero, piso, sector, tipo, capacidad, estado = "disponible") => ({
  id: String(numero), numero, piso, sector, tipo, capacidad, estado,
});

export const HABITACIONES = [
  hab(101, 1, "Internación", "Individual", 1),
  hab(102, 1, "Internación", "Compartida", 2),
  hab(103, 1, "Internación", "Individual", 1),
  hab(104, 1, "Internación", "Aislamiento", 1, "mantenimiento"),
  hab(201, 2, "Terapia intensiva", "Individual", 1),
  hab(202, 2, "Terapia intensiva", "Individual", 1),
  hab(203, 2, "Terapia intensiva", "Individual", 1),
  hab(301, 3, "Maternidad", "Individual", 1),
  hab(302, 3, "Maternidad", "Compartida", 2),
  hab(11, 0, "Guardia", "Individual", 1),
  hab(12, 0, "Guardia", "Individual", 1),
];