import React from 'react';
import { Search, Clock, Sparkles } from 'lucide-react';

interface RecommendationFormProps {
  onSearch: (interest: string, time: number) => void;
  isLoading: boolean;
}

export const RecommendationForm: React.FC<RecommendationFormProps> = ({ onSearch, isLoading }) => {
  const [interest, setInterest] = React.useState('');
  const [time, setTime] = React.useState(30);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (interest.trim()) {
      onSearch(interest, time);
    }
  };

  return (
    <div className="bg-zinc-900/80 backdrop-blur-xl p-8 rounded-2xl border border-zinc-800 shadow-2xl max-w-2xl mx-auto -mt-20 relative z-40">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <Search className="w-4 h-4" /> What are you interested in?
          </label>
          <input 
            type="text"
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            placeholder="e.g. Science Fiction, History, Self-improvement..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600 transition"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4" /> How much time do you have? ({time} mins)
          </label>
          <input 
            type="range"
            min="5"
            max="300"
            step="5"
            value={time}
            onChange={(e) => setTime(parseInt(e.target.value))}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-600"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>5m</span>
            <span>1h</span>
            <span>2h</span>
            <span>3h</span>
            <span>5h</span>
          </div>
        </div>

        <button 
          type="submit"
          disabled={isLoading || !interest.trim()}
          className="w-full bg-red-600 text-white py-4 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Sparkles className="w-5 h-5" /> Get Recommendations
            </>
          )}
        </button>
      </form>
    </div>
  );
};
