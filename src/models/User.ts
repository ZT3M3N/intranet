import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  nombres: {
    type: String,
    required: [true, "El nombre es requerido"],
    minLength: [2, "El nombre debe tener al menos 2 caracteres"],
  },
  apellidos: {
    type: String,
    required: [true, "Los apellidos son requeridos"],
    minLength: [2, "Los apellidos deben tener al menos 2 caracteres"],
  },
  email: {
    type: String,
    required: [true, "El email es requerido"],
    unique: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Por favor ingresa un email válido"],
  },
  area: {
    type: String,
    required: [true, "El área es requerida"],
    enum: [
      "Almacen",
      "Compras",
      "Sistemas",
      "Recursos Humanos",
      "Contabilidad",
      "Atención a Clientes",
      "Marketing",
      "Comercialización",
      "Prevención y Riesgos",
      "Logística",
      "Cuentas por Pagar",
      "Gestión y Desarrollo",
    ],
  },
  password: {
    type: String,
    required: [true, "La contraseña es requerida"],
  },
}, {
  timestamps: true,
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);