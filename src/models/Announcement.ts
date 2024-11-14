// src/models/Announcement.ts
import { ObjectId } from 'mongodb';

export interface AnnouncementModel {
  _id?: ObjectId;
  author: string;
  avatar: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  comments: CommentModel[];
}

export interface CommentModel {
  _id?: ObjectId;
  name: string;
  area: string;
  comment: string;
  createdAt: Date;
}