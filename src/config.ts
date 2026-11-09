// Datos del consultorio. Edita aquí teléfono, enlaces y horarios sugeridos.
export const SITE = {
  name: "Reyes Ortodoncia",
  doctor: "Dr. Edinson Vladimir Reyes Jiménez",
  city: "Chiclayo",
  address: "Manuel María Izaga 360, Chiclayo",
  phone: "943 862 770",
  wa: "51943862770", // WhatsApp con código de país, sin + ni espacios
  social: {
    tiktok: "https://www.tiktok.com/@reyes.ortodoncia",
    instagram: "https://www.instagram.com/reyes.ortodoncia",
    facebook: "https://www.facebook.com/REYESortodoncia",
  },
  maps: "https://www.google.com/maps/search/?api=1&query=Manuel+Mar%C3%ADa+Izaga+360+Chiclayo",
  /**
   * Calendario en línea con Cal.com. Cuando tengas la cuenta, escribe aquí "usuario/evento"
   * (por ejemplo "reyes-ortodoncia/evaluacion"). Mientras esté vacío, la reserva funciona por WhatsApp.
   */
  calLink: "",
  /** Horarios SUGERIDOS en el formulario (provisional: confirmar con el doctor). */
  slots: ["9:00 am", "10:00 am", "11:00 am", "3:00 pm", "4:00 pm", "5:00 pm"],
  /** Días de la semana que se ofrecen (0 = domingo). Provisional: confirmar con el doctor. */
  days: [1, 2, 3, 4, 5, 6],
};
