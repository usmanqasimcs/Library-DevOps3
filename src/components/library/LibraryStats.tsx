
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
    className="flex gap-3 w-full overflow-x-auto pb-2"
    data-testid="stats-section"
    style={{ WebkitOverflowScrolling: 'touch' }}
  >
    <Card className="min-w-[150px] flex-1 bg-white/95 border-blue-200 shadow">
      <CardContent className="p-3 text-center">
        <div className="text-xl font-bold text-gray-900 truncate" data-testid="total-books">{total}</div>
        <div className="text-xs text-gray-500">Total Books</div>
      </CardContent>
    </Card>
    <Card className="min-w-[150px] flex-1 bg-blue-50/80 border-blue-200 shadow">
      <CardContent className="p-3 text-center">
        <div className="text-xl font-bold text-blue-700" data-testid="reading-books">{reading}</div>
        <div className="text-xs text-blue-500">Currently Reading</div>
      </CardContent>
    </Card>
    <Card className="min-w-[150px] flex-1 bg-green-50/80 border-green-200 shadow">
      <CardContent className="p-3 text-center">
        <div className="text-xl font-bold text-green-700" data-testid="finished-books">{finished}</div>
        <div className="text-xs text-green-600">Finished</div>
      </CardContent>
    </Card>
    <Card className="min-w-[150px] flex-1 bg-slate-50/80 border-slate-200 shadow">
      <CardContent className="p-3 text-center">
        <div className="text-xl font-bold text-slate-700" data-testid="unread-books">{notRead}</div>
        <div className="text-xs text-slate-500">Not Read</div>
      </CardContent>
    </Card>
    <Card
      className="min-w-[150px] flex-1 cursor-pointer border-yellow-300 hover:shadow-xl hover:bg-yellow-50 duration-150 transition-all shadow"
      onClick={onFavoritesClick}
      tabIndex={0}
      aria-label="View favorite books"
      style={{ outline: 'none' }}
      data-testid="favorites-books-tile"
    >
      <CardContent className="p-3 text-center flex flex-col items-center">
        <div className="flex items-center gap-1 justify-center">
          <Star className="text-yellow-400" size={19} fill="#facc15" />
          <span className="text-xl font-bold text-yellow-700" data-testid="favorites-books">{favorites}</span>
        </div>
        <div className="text-xs text-yellow-600">Favorites</div>
      </CardContent>
    </Card>
  </div>
);
