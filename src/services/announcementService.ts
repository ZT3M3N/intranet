// src/services/announcementService.ts
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { AnnouncementModel, CommentModel } from '@/models/Announcement';

export class AnnouncementService {
  private static async getCollection() {
    const client = await clientPromise;
    const collection = client.db('dashboard').collection('announcements');
    return collection;
  }

  static async createAnnouncement(announcement: Omit<AnnouncementModel, '_id' | 'comments' | 'createdAt' | 'updatedAt'>) {
    const collection = await this.getCollection();
    const now = new Date();
    const newAnnouncement = {
      ...announcement,
      comments: [],
      createdAt: now,
      updatedAt: now,
    };
    
    const result = await collection.insertOne(newAnnouncement);
    return result;
  }

  static async getAllAnnouncements() {
    const collection = await this.getCollection();
    const announcements = await collection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return announcements;
  }

  static async addComment(announcementId: string, comment: Omit<CommentModel, '_id' | 'createdAt'>) {
    const collection = await this.getCollection();
    const newComment = {
      ...comment,
      _id: new ObjectId(),
      createdAt: new Date(),
    };
    
    const result = await collection.updateOne(
      { _id: new ObjectId(announcementId) },
      { 
        $push: { comments: newComment },
        $set: { updatedAt: new Date() }
      }
    );
    return result;
  }

  static async deleteAnnouncement(id: string) {
    const collection = await this.getCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result;
  }

  static async updateAnnouncement(id: string, update: Partial<AnnouncementModel>) {
    const collection = await this.getCollection();
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          ...update,
          updatedAt: new Date()
        } 
      }
    );
    return result;
  }
}