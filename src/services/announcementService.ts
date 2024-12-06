import { connectDB } from "@/lib/mongodb";
import { Announcement } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { AnnouncementModel, CommentModel } from "@/models/Announcement";

export class AnnouncementService {
  static async getAllAnnouncements() {
    try {
      await connectDB();
      return await Announcement.find().sort({ createdAt: -1 });
    } catch (error) {
      console.error("Error in getAllAnnouncements:", error);
      throw error;
    }
  }

  static async createAnnouncement(data: {
    author: string;
    content: string;
    media?: Array<{ type: string; url: string; filename: string }>;
    avatar?: string;
  }) {
    try {
      await connectDB();
      console.log("Creating announcement with data:", data);

      const announcement = await Announcement.create({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log("Created announcement:", announcement);
      return announcement;
    } catch (error) {
      console.error("Error in createAnnouncement:", error);
      throw error;
    }
  }

  static async addComment(
    announcementId: string,
    comment: Omit<CommentModel, "_id" | "createdAt">
  ) {
    try {
      await connectDB();
      const result = await Announcement.findByIdAndUpdate(
        announcementId,
        {
          $push: { comments: { ...comment, createdAt: new Date() } },
          $set: { updatedAt: new Date() },
        },
        { new: true }
      );
      return result;
    } catch (error) {
      console.error("Error al añadir comentario:", error);
      throw new Error("Error al añadir el comentario");
    }
  }

  static async deleteAnnouncement(id: string) {
    try {
      await connectDB();
      const result = await Announcement.findByIdAndDelete(id);
      return result;
    } catch (error) {
      console.error("Error al eliminar anuncio:", error);
      throw new Error("Error al eliminar el anuncio");
    }
  }

  static async updateAnnouncement(
    id: string,
    update: Partial<AnnouncementModel>
  ) {
    try {
      await connectDB();
      const result = await Announcement.findByIdAndUpdate(
        id,
        {
          ...update,
          updatedAt: new Date(),
        },
        { new: true }
      );
      return result;
    } catch (error) {
      console.error("Error al actualizar anuncio:", error);
      throw new Error("Error al actualizar el anuncio");
    }
  }

  static async updateComment(
    announcementId: string,
    commentId: string,
    newComment: string
  ) {
    try {
      await connectDB();
      const result = await Announcement.findOneAndUpdate(
        {
          _id: announcementId,
          "comments._id": commentId,
        },
        {
          $set: {
            "comments.$.comment": newComment,
            updatedAt: new Date(),
          },
        },
        { new: true }
      );

      if (!result) {
        throw new Error("Anuncio o comentario no encontrado");
      }

      return result;
    } catch (error) {
      console.error("Error al actualizar comentario:", error);
      throw new Error("Error al actualizar el comentario");
    }
  }

  static async deleteComment(announcementId: string, commentId: string) {
    try {
      await connectDB();
      const result = await Announcement.findByIdAndUpdate(
        announcementId,
        {
          $pull: { comments: { _id: commentId } },
          $set: { updatedAt: new Date() },
        },
        { new: true }
      );

      if (!result) {
        throw new Error("Anuncio o comentario no encontrado");
      }

      return result;
    } catch (error) {
      console.error("Error al eliminar comentario:", error);
      throw new Error("Error al eliminar el comentario");
    }
  }
}
