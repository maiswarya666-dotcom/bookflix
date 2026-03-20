import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Book } from '../types';
import { BookCard } from './BookCard';

interface BookRowProps {
  title: string;
  books: Book[];
  onRefreshFavorites?: () => void;
}

export const BookRow: React.FC<BookRowProps> = ({ title, books, onRefreshFavorites }) => {
  const rowRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (books.length === 0) return null;

  return (
    <div className="space-y-2 md:space-y-4 px-4 md:px-12 py-4 group">
      <h2 className="text-xl md:text-2xl font-bold text-gray-200 transition duration-200 hover:text-white cursor-pointer">
        {title}
      </h2>
      
      <div className="relative">
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-30 w-12 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center hover:bg-black/60"
        >
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>

        <div 
          ref={rowRef}
          className="flex gap-2 md:gap-4 overflow-x-auto scrollbar-hide pb-4"
        >
          {books.map((book) => (
            <BookCard 
              key={book.id} 
              book={book} 
              onRefreshFavorites={onRefreshFavorites}
            />
          ))}
        </div>

        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-30 w-12 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center hover:bg-black/60"
        >
          <ChevronRight className="w-8 h-8 text-white" />
        </button>
      </div>
    </div>
  );
};
