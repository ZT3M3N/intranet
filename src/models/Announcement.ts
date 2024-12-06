export type AnnouncementModel = {
  _id?: string;
  author: string;
  content: string;
  avatar?: string;
  media?: Array<{
    type: string;
    url: string;
    filename: string;
  }>;
  comments?: Array<{
    _id?: string;
    name: string;
    area: string;
    comment: string;
    createdAt?: Date;
  }>;
  createdAt?: Date;
  updatedAt?: Date;
};
