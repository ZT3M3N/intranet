export interface Announcement {
  _id?: string;
  id?: string;
  author: string;
  content: string;
  avatar?: string;
  media?: Array<{ type: string; url: string; filename: string }>;
  comments?: Array<Comment>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Comment {
  _id: string;
  name: string;
  area: string;
  comment: string;
  approved?: boolean;
  status?: string;
}
