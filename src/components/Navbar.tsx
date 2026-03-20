import React from 'react';
import { BookOpen, Heart, Search, User } from 'lucide-react';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

interface NavbarProps {
  onShowFavorites: () => void;
  onShowHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onShowFavorites, onShowHome }) => {
  const [user, setUser] = React.useState(auth.currentUser);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = () => signOut(auth);

  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-b from-black/80 to-transparent px-4 py-4 md:px-12 flex items-center justify-between transition-colors duration-300 hover:bg-black">
      <div className="flex items-center gap-8">
        <div 
          className="text-red-600 text-3xl font-bold tracking-tighter cursor-pointer flex items-center gap-2"
          onClick={onShowHome}
        >
          <BookOpen className="w-8 h-8" />
          BOOKFLIX
        </div>
        <div className="hidden md:flex items-center gap-4 text-sm font-medium text-gray-300">
          <button onClick={onShowHome} className="hover:text-white transition">Home</button>
          <button className="hover:text-white transition">New & Popular</button>
          <button onClick={onShowFavorites} className="hover:text-white transition">My List</button>
        </div>
      </div>

      <div className="flex items-center gap-6 text-white">
        <Search className="w-5 h-5 cursor-pointer hover:text-gray-300 transition" />
        <Heart 
          className="w-5 h-5 cursor-pointer hover:text-red-500 transition" 
          onClick={onShowFavorites}
        />
        {user ? (
          <div className="flex items-center gap-3 group relative">
            <img 
              src={user.photoURL || ''} 
              alt={user.displayName || ''} 
              className="w-8 h-8 rounded cursor-pointer"
              referrerPolicy="no-referrer"
            />
            <div className="absolute right-0 top-full mt-2 hidden group-hover:block bg-zinc-900 border border-zinc-800 p-2 rounded shadow-xl min-w-[120px]">
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-800 rounded transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={handleLogin}
            className="bg-red-600 text-white px-4 py-1 rounded text-sm font-medium hover:bg-red-700 transition"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};
