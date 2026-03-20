import React from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { BookCard } from './BookCard';
import { Book } from '../types';
import { HeartOff } from 'lucide-react';

export const Favorites: React.FC = () => {
  const [favorites, setFavorites] = React.useState<Book[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'favorites'),
      where('uid', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const favs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Book[];
      setFavorites(favs);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'favorites');
    });

    return () => unsubscribe();
  }, []);

  if (!auth.currentUser) {
    return (
      <div className="pt-32 px-4 md:px-12 text-center h-screen bg-black">
        <h2 className="text-3xl font-bold text-white mb-4">My List</h2>
        <p className="text-gray-400">Please sign in to view your favorite books.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="pt-32 px-4 md:px-12 text-center h-screen bg-black">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="pt-32 px-4 md:px-12 min-h-screen bg-black pb-20">
      <h2 className="text-3xl font-bold text-white mb-8">My List</h2>
      
      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <HeartOff className="w-16 h-16 mb-4 opacity-20" />
          <p className="text-xl">You haven't added any books to your list yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {favorites.map((book) => (
            <BookCard key={book.id} book={book} isFavorite={true} />
          ))}
        </div>
      )}
    </div>
  );
};
