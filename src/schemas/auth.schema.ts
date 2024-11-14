import { z, ZodSchema } from "zod";

export const signupSchema: ZodSchema = z
  .object({
    nombre: z
      .string({
        required_error: "El nombre es requerido.",
      })
      .min(2)
      .max(50),
    apellidos: z
      .string({
        required_error: "El/Los apellidos son requeridos.",
      })
      .min(2)
      .max(50),
    correo: z
      .string({
        required_error: "El correo es requerido.",
      })
      .email(),
    contraseña: z
      .string({
        required_error: "La contraseña es requerida.",
      })
      .min(6)
      .max(50),
    confirmarContraseña: z
      .string({
        required_error: "La confirmación de la contraseña es requerida.",
      })
      .min(6)
      .max(50),
  })
  .refine((data) => data.contraseña === data.confirmarContraseña, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });
 