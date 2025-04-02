import { connectDB } from "@/lib/mongodb";
import { Announcement } from "@/models/Announcement";
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

  static async approveComment(announcementId: string, commentId: string) {
    try {
      await connectDB();

      const result = await Announcement.findOneAndUpdate(
        {
          _id: announcementId,
          "comments._id": commentId,
        },
        {
          $set: {
            "comments.$.approved": true,
            "comments.$.status": "approved",
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!result) {
        throw new Error("Anuncio o comentario no encontrado");
      }

      // Verificar si el comentario fue actualizado
      const updatedComment = result.comments?.find(
        (c: any) => c._id.toString() === commentId
      );

      if (!updatedComment?.approved) {
        throw new Error("El comentario no se actualizó correctamente");
      }

      return result;
    } catch (error) {
      console.error("Error al aprobar comentario:", error);
      throw error;
    }
  }

  static async rejectComment(announcementId: string, commentId: string) {
    try {
      await connectDB();
      const result = await Announcement.findOneAndUpdate(
        { _id: announcementId },
        {
          $pull: {
            comments: { _id: commentId },
          },
          $set: {
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
      console.error("Error al rechazar comentario:", error);
      throw new Error("Error al rechazar el comentario");
    }
  }

  static async getPendingComments(announcementId: string) {
    try {
      await connectDB();
      const announcement = await Announcement.findById(announcementId);
      if (!announcement) {
        return [];
      }
      // Modificamos el filtro para considerar tanto approved como status
      return announcement.comments.filter(
        (comment: any) =>
          !comment.approved && (!comment.status || comment.status === "pending")
      );
    } catch (error) {
      console.error("Error al obtener comentarios pendientes:", error);
      throw new Error("Error al obtener comentarios pendientes");
    }
  }

  static async updateAnnouncementWithMedia(
    id: string,
    update: Partial<AnnouncementModel>,
    newMedia: Array<{ type: string; url: string; filename: string; fileId: string }> = [],
    mediaToRemove: string[] = [],
    existingMediaIds: string[] = []
  ) {
    try {
      await connectDB();
      
      // Obtener el anuncio actual
      const currentAnnouncement = await Announcement.findById(id);
      
      if (!currentAnnouncement) {
        throw new Error("Anuncio no encontrado");
      }
      
      // Preparar la operación de actualización
      const updateOperation: any = {
        ...update,
        updatedAt: new Date(),
      };
      
      // Gestionar los medios
      // 1. Si hay medios existentes, filtrarlos según los que se quieren conservar
      if (currentAnnouncement.media && currentAnnouncement.media.length > 0) {
        // Filtrar los medios que no están en la lista de "mediaToRemove"
        const filteredMedia = currentAnnouncement.media.filter(
          (media: any) => !mediaToRemove.includes(media.fileId.toString())
        );
        
        // 2. Añadir los nuevos medios
        updateOperation.media = [...filteredMedia, ...newMedia];
      } else {
        // Si no hay medios existentes, simplemente usar los nuevos
        updateOperation.media = newMedia;
      }
      
      // Realizar la actualización
      const result = await Announcement.findByIdAndUpdate(
        id,
        updateOperation,
        { new: true }
      );
      
      return result;
    } catch (error) {
      console.error("Error al actualizar anuncio con medios:", error);
      throw new Error("Error al actualizar el anuncio");
    }
  }
}
