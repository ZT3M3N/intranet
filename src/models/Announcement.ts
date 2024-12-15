import mongoose, { Schema } from "mongoose";

// Definir el esquema para media
const mediaSchema = new Schema({
  type: { type: String, required: true },
  url: { type: String, required: true },
  filename: { type: String, required: true },
  fileId: { type: mongoose.Types.ObjectId, required: true },
});

// Definir el esquema para comentarios
const commentSchema = new Schema({
  name: { type: String, required: true },
  area: { type: String, required: true },
  comment: { type: String, required: true },
  approved: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

// Definir el esquema principal del anuncio
const announcementSchema = new Schema(
  {
    author: { type: String, required: true },
    content: { type: String, required: true },
    media: [mediaSchema], // Array de media
    avatar: {
      type: String,
      default:
        "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
    },
    comments: [commentSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // Asegura que las virtuals se incluyan en la conversión a JSON
    toObject: { virtuals: true },
  }
);

// Eliminar el modelo existente si ya está definido
mongoose.models = {};

// Crear y exportar el modelo
export const Announcement =
  mongoose.models.Announcement ||
  mongoose.model("Announcement", announcementSchema);

// Tipos TypeScript
export interface Media {
  type: string;
  url: string;
  filename: string;
}

export interface Comment {
  _id: string;
  name: string;
  area: string;
  comment: string;
  approved?: boolean;
  status?: string;
  createdAt?: Date;
}

export interface AnnouncementModel {
  _id?: string;
  author: string;
  content: string;
  media?: Media[];
  avatar?: string;
  comments?: Comment[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CommentModel {
  _id?: string;
  content: string;
  author: string;
  createdAt: Date;
  approved: boolean;
  status?: "pending" | "approved" | "rejected";
}
