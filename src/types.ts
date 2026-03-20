export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  rating: number;
  description: string;
  interest: string;
  readingTime: number; // in minutes
}

export interface UserFavorite extends Book {
  uid: string;
  createdAt: string;
}
