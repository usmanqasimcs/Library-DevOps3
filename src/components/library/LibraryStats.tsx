
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface LibraryStatsProps {
  total: number;
  reading: number;
  finished: number;
  notRead: number;
  favorites: number;
  onFavoritesClick?: () => void;
}

export const LibraryStats: React.FC<LibraryStatsProps> = ({
  total, reading, finished, notRead, favorites, onFavoritesClick
}) => (
  <div
    className="flex flex-col sm:flex-row gap-5 w-full overflow-x-auto pb-2"
    data-testid="stats-section"
    style={{ WebkitOverflowScrolling: 'touch' }}
  >
    <Card className="min-w-[140px] flex-1 bg-gradient-to-tr from-blue-50 via-white to-purple-50 border-blue-200 shadow">
      <CardContent className="p-3 text-center">
        <div className="text-2xl font-bold text-sky-900 truncate" data-testid="total-books">{total}</div>
        <div className="text-xs text-blue-600">Total Books</div>
      </CardContent>
    </Card>
    <Card className="min-w-[140px] flex-1 bg-gradient-to-br from-blue-100 via-white to-blue-200 border-blue-200 shadow">
      <CardContent className="p-3 text-center">
        <div className="text-2xl font-bold text-blue-700" data-testid="reading-books">{reading}</div>
        <div className="text-xs text-blue-500">Reading</div>
      </CardContent>
    </Card>
    <Card className="min-w-[140px] flex-1 bg-gradient-to-br from-green-100 via-white to-green-300 border-green-200 shadow">
      <CardContent className="p-3 text-center">
        <div className="text-2xl font-bold text-green-700" data-testid="finished-books">{finished}</div>
        <div className="text-xs text-green-600">Finished</div>
      </CardContent>
    </Card>
    <Card className="min-w-[140px] flex-1 bg-gradient-to-br from-slate-100 via-white to-slate-200 border-slate-200 shadow">
      <CardContent className="p-3 text-center">
        <div className="text-2xl font-bold text-slate-700" data-testid="unread-books">{notRead}</div>
        <div className="text-xs text-slate-500">Not Read</div>
      </CardContent>
    </Card>
    <Card
      className="min-w-[140px] flex-1 cursor-pointer border-yellow-300 bg-gradient-to-tr from-yellow-100 via-white to-yellow-200 hover:shadow-xl hover:bg-yellow-50 duration-150 transition-all shadow"
      onClick={onFavoritesClick}
      tabIndex={0}
      aria-label="View favorite books"
      style={{ outline: 'none' }}
      data-testid="favorites-books-tile"
    >
      <CardContent className="p-3 text-center flex flex-col items-center">
        <div className="flex items-center gap-1 justify-center">
          <Star className="text-yellow-400" size={19} fill="#facc15" />
          <span className="text-2xl font-bold text-yellow-700" data-testid="favorites-books">{favorites}</span>
        </div>
        <div className="text-xs text-yellow-600">Favorites</div>
      </CardContent>
    </Card>
  </div>
);

