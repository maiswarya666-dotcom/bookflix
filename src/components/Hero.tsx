import React from 'react';
import { Info, Play } from 'lucide-react';
import { Book } from '../types';

interface HeroProps {
  featuredBook?: Book;
  onGetStarted: () => void;
}

export const Hero: React.FC<HeroProps> = ({ featuredBook, onGetStarted }) => {
  if (!featuredBook) {
    return (
      <div className="relative h-[80vh] w-full flex items-center justify-center bg-black overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=2000" 
            alt="Library background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Unlimited books, stories, and more.
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8">
            Ready to read? Enter your interests to find your next favorite book.
          </p>
          <button 
            onClick={onGetStarted}
            className="bg-red-600 text-white px-8 py-4 rounded text-xl font-bold flex items-center gap-2 mx-auto hover:bg-red-700 transition transform hover:scale-105"
          >
            Get Started <Play className="fill-current" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[85vh] w-full flex items-center px-4 md:px-12 bg-black overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src={featuredBook.coverUrl} 
          alt={featuredBook.title} 
          className="w-full h-full object-cover opacity-60 blur-sm scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
      </div>

      <div className="relative z-10 max-w-2xl">
        <div className="flex items-center gap-2 text-emerald-500 font-bold text-lg mb-2">
          <span>98% Match</span>
          <span className="text-gray-400 font-normal">2024</span>
          <span className="border border-gray-500 px-1 text-xs text-gray-300">HD</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 line-clamp-2">
          {featuredBook.title}
        </h1>
        <p className="text-lg text-gray-200 mb-8 line-clamp-3 md:line-clamp-4 leading-relaxed">
          {featuredBook.description}
        </p>
        <div className="flex items-center gap-4">
          <button className="bg-white text-black px-6 py-2 rounded font-bold flex items-center gap-2 hover:bg-gray-200 transition">
            <Play className="fill-current w-5 h-5" /> Read Now
          </button>
          <button className="bg-gray-500/50 text-white px-6 py-2 rounded font-bold flex items-center gap-2 hover:bg-gray-500/70 transition backdrop-blur-md">
            <Info className="w-5 h-5" /> More Info
          </button>
        </div>
      </div>
    </div>
  );
};
