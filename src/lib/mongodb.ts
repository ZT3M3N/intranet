import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Por favor define la variable de entorno MONGODB_URI");
}

// Esquema para media
const mediaSchema = new mongoose.Schema({
  type: String,
  url: String,
  filename: String,
});

// Esquema para anuncios
const announcementSchema = new mongoose.Schema({
  author: String,
  avatar: String,
  content: String,
  media: [mediaSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  comments: [
    {
      name: String,
      area: String,
      comment: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

export const Announcement =
  mongoose.models.Announcement ||
  mongoose.model("Announcement", announcementSchema);

export async function connectDB() {
  try {
    const { connection } = await mongoose.connect(MONGODB_URI);
    if (connection.readyState === 1) {
      console.log("MongoDB conectado");
      return Promise.resolve(true);
    }
  } catch (error) {
    console.error("Error conectando a MongoDB:", error);
    return Promise.reject(error);
  }
}
