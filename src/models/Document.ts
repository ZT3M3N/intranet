import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  fileId: { type: mongoose.Schema.Types.ObjectId, required: true },
  fileName: { type: String, required: true },
  fileSize: { type: Number, required: true },
  contentType: { type: String, required: true },
  uploadedBy: { type: String, required: true },
  fileUrl: { type: String, required: true }, // Asegúrate de que este campo esté presente
  uploadDate: { type: Date, default: Date.now },
});

export const Document =
  mongoose.models.Document || mongoose.model("Document", documentSchema);
