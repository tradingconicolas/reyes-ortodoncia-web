// Casos del consultorio (videos de TikTok @reyes.ortodoncia, comprimidos en public/casos).
export type Caso = {
  id: string;
  titulo: string;
  resumen: string;
  tags: string[];
  estado: "Terminado" | "En proceso" | "Avance";
};

export const FILTROS: { id: string; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "clase1", label: "Clase I" },
  { id: "clase2", label: "Clase II" },
  { id: "clase3", label: "Clase III" },
  { id: "mordida", label: "Mordidas" },
  { id: "miniimplantes", label: "Mini implantes" },
  { id: "ortopedia", label: "Ortopedia" },
  { id: "complejo", label: "Casos complejos" },
];

export const CASOS: Caso[] = [
  {
    id: "7635693604098395413",
    titulo: "Mordida profunda · Clase II división 2",
    resumen: "Se resolvió con un arco de intrusión de tres piezas de Burstone. Relaciones molar y canina en Clase I.",
    tags: ["clase2", "mordida"],
    estado: "Terminado",
  },
  {
    id: "7434055410060987653",
    titulo: "Mordida cruzada posterior unilateral",
    resumen: "Caso terminado de mordida cruzada posterior de un solo lado.",
    tags: ["mordida"],
    estado: "Terminado",
  },
  {
    id: "7433647829828029702",
    titulo: "Clase I con apiñamiento severo",
    resumen: "Caso terminado con extracción de cuatro premolares.",
    tags: ["clase1"],
    estado: "Terminado",
  },
  {
    id: "7541480029767617799",
    titulo: "Mordida abierta",
    resumen: "Avance de un caso tratado con Hyrax, arco lingual y mini implantes infracigomáticos.",
    tags: ["mordida", "miniimplantes"],
    estado: "Avance",
  },
  {
    id: "7693033228977966356",
    titulo: "Clase III sin extracciones",
    resumen: "Jig distalizador con mini implante: de Clase III a Clase I (6-5-4-3) sin extraer piezas.",
    tags: ["clase3", "miniimplantes"],
    estado: "Terminado",
  },
  {
    id: "7406458601667185926",
    titulo: "Clase III por retrusión maxilar",
    resumen: "En dentición mixta: Hyrax y máscara facial con elásticos para guiar el crecimiento del maxilar.",
    tags: ["clase3", "ortopedia"],
    estado: "Avance",
  },
  {
    id: "7683713971999870229",
    titulo: "Incisivos retenidos y caninos",
    resumen: "Ventana quirúrgica y tracción ortodóncica; distalización con cadenas de poder de 100 g.",
    tags: ["complejo"],
    estado: "En proceso",
  },
  {
    id: "7693904316523990292",
    titulo: "Adulto con molares extruidos",
    resumen: "Mini implantes como anclaje, intrusión controlada de molares y luego alineación de toda la arcada.",
    tags: ["miniimplantes", "complejo"],
    estado: "Terminado",
  },
];

export const PLAN_DESTACADO = [
  {
    n: 1,
    titulo: "Plano de mordida anterior fijo",
    texto: "Abre la mordida profunda desde el inicio, sin esperar a los brackets.",
    teeth: [13, 12, 11, 21, 22, 23],
    mark: [] as number[],
  },
  {
    n: 2,
    titulo: "Arco lingual removible",
    texto: "Vestibulariza los molares para ganar espacio y control.",
    teeth: [16, 26, 36, 46],
    mark: [] as number[],
  },
  {
    n: 3,
    titulo: "Extracción de las piezas 14 y 24",
    texto: "Crea el espacio para corregir el resalte aumentado.",
    teeth: [14, 24],
    mark: [14, 24],
  },
  {
    n: 4,
    titulo: "Cierre de espacios por deslizamiento",
    texto: "Los dientes se deslizan por el arco para cerrar el espacio de forma controlada.",
    teeth: [13, 15, 23, 25],
    mark: [] as number[],
  },
  {
    n: 5,
    titulo: "Aún falta: intrusión de incisivos inferiores",
    texto: "Con arco de Burstone. El caso sigue en tratamiento.",
    teeth: [32, 31, 41, 42],
    mark: [] as number[],
    pendiente: true,
  },
];
