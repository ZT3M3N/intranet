import { Document } from "@/models/Document";
import { connectDB } from "@/lib/mongodb";

export const DocumentService = {
  async getAllDocuments() {
    await connectDB();
    return Document.find().sort({ uploadDate: -1 });
  },

  async createDocument(documentData: any) {
    await connectDB();
    return Document.create(documentData);
  },

  async deleteDocument(id: string) {
    await connectDB();
    return Document.findByIdAndDelete(id);
  },

  async getDocumentsByCategory(category: string) {
    await connectDB();
    return Document.find({ category });
  },
};
