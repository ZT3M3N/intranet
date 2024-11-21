import { connectDB } from '@/lib/mongodb';
import { Announcement } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { AnnouncementModel, CommentModel } from '@/models/Announcement';

export class AnnouncementService {
  static async getAllAnnouncements() {
    try {
      await connectDB();
      const announcements = await Announcement
        .find({})
        .sort({ createdAt: -1 });
      return announcements;
    } catch (error) {
      console.error('Error al obtener anuncios:', error);
      throw new Error('Error al obtener los anuncios');
    }
  }

  static async createAnnouncement(announcement: Omit<AnnouncementModel, '_id' | 'comments' | 'createdAt' | 'updatedAt'>) {
    try {
      await connectDB();
      const newAnnouncement = new Announcement({
        ...announcement,
        comments: [],
      });
      const result = await newAnnouncement.save();
      return result;
    } catch (error) {
      console.error('Error al crear anuncio:', error);
      throw new Error('Error al crear el anuncio');
    }
  }

  static async addComment(announcementId: string, comment: Omit<CommentModel, '_id' | 'createdAt'>) {
    try {
      await connectDB();
      const result = await Announcement.findByIdAndUpdate(
        announcementId,
        {
          $push: { comments: { ...comment, createdAt: new Date() } },
          $set: { updatedAt: new Date() }
        },
        { new: true }
      );
      return result;
    } catch (error) {
      console.error('Error al añadir comentario:', error);
      throw new Error('Error al añadir el comentario');
    }
  }

  static async deleteAnnouncement(id: string) {
    try {
      await connectDB();
      const result = await Announcement.findByIdAndDelete(id);
      return result;
    } catch (error) {
      console.error('Error al eliminar anuncio:', error);
      throw new Error('Error al eliminar el anuncio');
    }
  }

  static async updateAnnouncement(id: string, update: Partial<AnnouncementModel>) {
    try {
      await connectDB();
      const result = await Announcement.findByIdAndUpdate(
        id,
        { 
          ...update,
          updatedAt: new Date()
        },
        { new: true }
      );
      return result;
    } catch (error) {
      console.error('Error al actualizar anuncio:', error);
      throw new Error('Error al actualizar el anuncio');
    }
  }
}