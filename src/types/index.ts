// src/types/index.ts
export interface MenuItem {
  title: string;
  href: string;
  icon: unknown;
  section: string;
}

export interface Document {
  name: string;
  url: string;
}

export interface Documents {
  important: Document[];
  company: Document[];
  internal: Document[];
  nom: Document[];
}

export interface Media {
  type: string;
  url: string;
  filename: string;
  fileId: string | number;
}

export interface Announcement {
  _id?: string;
  author: string;
  content: string;
  media?: Media[];
  avatar?: string;
  comments?: Comment[];
}

export interface Comment {
  _id: string;
  name: string;
  area: string;
  comment: string;
  approved?: boolean;
  createdAt?: string;
}

export interface Comments {
  [key: number]: Comment[];
}
