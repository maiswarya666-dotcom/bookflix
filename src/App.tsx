import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BookRow } from './components/BookRow';
import { RecommendationForm } from './components/RecommendationForm';
import { Favorites } from './components/Favorites';
import { ErrorBoundary } from './components/ErrorBoundary';
import { getBookSuggestions, getTrendingBooks } from './services/bookService';
import { Book } from './types';
import { auth, db } from './firebase';
import { doc, getDocFromServer } from 'firebase/firestore';

export default function App() {
  const [view, setView] = React.useState<'home' | 'favorites'>('home');
  const [trendingBooks, setTrendingBooks] = React.useState<Book[]>([]);
  const [recommendedBooks, setRecommendedBooks] = React.useState<Book[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [isAuthReady, setIsAuthReady] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(() => {
      setIsAuthReady(true);
    });

    // Test Firestore connection
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    };
    testConnection();

    // Load trending books
    const loadTrending = async () => {
      const trending = await getTrendingBooks();
      setTrendingBooks(trending);
    };
    loadTrending();

    return () => unsubscribe();
  }, []);

  const handleSearch = async (interest: string, time: number) => {
    setLoading(true);
    const suggestions = await getBookSuggestions(interest, time);
    setRecommendedBooks(suggestions);
    setLoading(false);
    
    // Scroll to results
    setTimeout(() => {
      const resultsElement = document.getElementById('results');
      resultsElement?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-black text-white selection:bg-red-600/30">
        <Navbar 
          onShowFavorites={() => setView('favorites')} 
          onShowHome={() => setView('home')} 
        />

        {view === 'home' ? (
          <main className="pb-20">
            <Hero 
              featuredBook={trendingBooks[0]} 
              onGetStarted={() => document.getElementById('search-form')?.scrollIntoView({ behavior: 'smooth' })} 
            />
            
            <div id="search-form" className="px-4 md:px-12">
              <RecommendationForm onSearch={handleSearch} isLoading={loading} />
            </div>

            <div className="mt-12 space-y-8 md:space-y-12">
              {recommendedBooks.length > 0 && (
                <div id="results">
                  <BookRow title="Suggested for You" books={recommendedBooks} />
                </div>
              )}
              
              <BookRow title="Trending Now" books={trendingBooks} />
              
              {/* Categorized Rows from Trending */}
              {trendingBooks.length > 0 && (
                <>
                  <BookRow 
                    title="Popular in Literature" 
                    books={trendingBooks.slice(0, 5)} 
                  />
                  <BookRow 
                    title="Binge-Worthy Reads" 
                    books={trendingBooks.slice(5, 10)} 
                  />
                </>
              )}
            </div>
          </main>
        ) : (
          <Favorites />
        )}

        <footer className="py-12 px-4 md:px-12 border-t border-zinc-900 text-gray-500 text-sm">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-2">
              <p className="hover:underline cursor-pointer">Audio Description</p>
              <p className="hover:underline cursor-pointer">Help Center</p>
              <p className="hover:underline cursor-pointer">Gift Cards</p>
            </div>
            <div className="space-y-2">
              <p className="hover:underline cursor-pointer">Media Center</p>
              <p className="hover:underline cursor-pointer">Investor Relations</p>
              <p className="hover:underline cursor-pointer">Jobs</p>
            </div>
            <div className="space-y-2">
              <p className="hover:underline cursor-pointer">Terms of Use</p>
              <p className="hover:underline cursor-pointer">Privacy</p>
              <p className="hover:underline cursor-pointer">Legal Notices</p>
            </div>
            <div className="space-y-2">
              <p className="hover:underline cursor-pointer">Cookie Preferences</p>
              <p className="hover:underline cursor-pointer">Corporate Information</p>
              <p className="hover:underline cursor-pointer">Contact Us</p>
            </div>
          </div>
          <p>© 2026 Bookflix, Inc.</p>
        </footer>
      </div>
    </ErrorBoundary>
  );
}
