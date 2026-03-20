import React from 'react';
import { Heart, Play, Plus, Star } from 'lucide-react';
import { Book } from '../types';
import { motion } from 'motion/react';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { addDoc, collection, serverTimestamp, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';

interface BookCardProps {
  book: Book;
  isFavorite?: boolean;
  onRefreshFavorites?: () => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, isFavorite: initialIsFavorite = false, onRefreshFavorites }) => {
  const [isFavorite, setIsFavorite] = React.useState(initialIsFavorite);
  const [loading, setLoading] = React.useState(false);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!auth.currentUser) {
      alert("Please sign in to save favorites");
      return;
    }

    setLoading(true);
    try {
      if (isFavorite) {
        // Remove from favorites
        const q = query(
          collection(db, 'favorites'), 
          where('uid', '==', auth.currentUser.uid),
          where('title', '==', book.title)
        );
        const snapshot = await getDocs(q);
        for (const d of snapshot.docs) {
          await deleteDoc(doc(db, 'favorites', d.id));
        }
        setIsFavorite(false);
      } else {
        // Add to favorites
        await addDoc(collection(db, 'favorites'), {
          ...book,
          uid: auth.currentUser.uid,
          createdAt: serverTimestamp()
        });
        setIsFavorite(true);
      }
      onRefreshFavorites?.();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'favorites');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="relative flex-none w-40 md:w-56 aspect-[2/3] group cursor-pointer"
      whileHover={{ scale: 1.05, zIndex: 20 }}
      transition={{ duration: 0.3 }}
    >
      <img 
        src={book.coverUrl} 
        alt={book.title} 
        className="w-full h-full object-cover rounded shadow-lg transition duration-300 group-hover:brightness-50"
        referrerPolicy="no-referrer"
      />
      
      <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="text-white font-bold text-sm md:text-base line-clamp-2 mb-1">{book.title}</h3>
        <p className="text-gray-300 text-xs mb-2">{book.author}</p>
        
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center text-yellow-500">
            <Star className="w-3 h-3 fill-current" />
            <span className="text-xs ml-1 font-bold">{book.rating}</span>
          </div>
          <span className="text-gray-400 text-[10px]">{book.readingTime}m</span>
        </div>

        <div className="flex items-center gap-2">
          <button className="bg-white p-2 rounded-full hover:bg-gray-200 transition">
            <Play className="w-4 h-4 text-black fill-current" />
          </button>
          <button 
            onClick={toggleFavorite}
            disabled={loading}
            className={`p-2 rounded-full border border-gray-500 hover:border-white transition ${isFavorite ? 'bg-red-600 border-red-600' : 'bg-zinc-800/50'}`}
          >
            {isFavorite ? <Heart className="w-4 h-4 text-white fill-current" /> : <Plus className="w-4 h-4 text-white" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
