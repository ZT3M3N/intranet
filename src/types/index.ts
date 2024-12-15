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

export interface Announcement {
  id: number;
  author: string;
  avatar: string;
  content: string;
}

export interface Comment {
  _id: string;
  name: string;
  area: string;
  comment: string;
  approved?: boolean;
  createdAt?: Date;
}

export interface Comments {
  [key: number]: Comment[];
}
