
export interface Book {
  _id?: string;
  title: string;
  author: string;
  status: 'not-read' | 'reading' | 'finished';
  publicationYear?: number;
  rating?: number;
  isFavorite?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
  _id?: string;
  email: string;
  password?: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
