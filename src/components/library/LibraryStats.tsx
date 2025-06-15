
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
    className="flex gap-2 w-full overflow-x-auto pb-2"
    data-testid="stats-section"
    style={{ WebkitOverflowScrolling: 'touch' }}
  >
    <Card className="min-w-[180px] flex-1">
      <CardContent className="p-2 text-center">
        <div className="text-lg font-bold text-gray-900 truncate" data-testid="total-books">{total}</div>
        <div className="text-xs text-gray-600 truncate">Total Books</div>
      </CardContent>
    </Card>
    <Card className="min-w-[180px] flex-1">
      <CardContent className="p-2 text-center">
        <div className="text-lg font-bold text-blue-600 truncate" data-testid="reading-books">{reading}</div>
        <div className="text-xs text-gray-600 truncate">Currently Reading</div>
      </CardContent>
    </Card>
    <Card className="min-w-[180px] flex-1">
      <CardContent className="p-2 text-center">
        <div className="text-lg font-bold text-green-600 truncate" data-testid="finished-books">{finished}</div>
        <div className="text-xs text-gray-600 truncate">Finished</div>
      </CardContent>
    </Card>
    <Card className="min-w-[180px] flex-1">
      <CardContent className="p-2 text-center">
        <div className="text-lg font-bold text-gray-600 truncate" data-testid="unread-books">{notRead}</div>
        <div className="text-xs text-gray-600 truncate">Not Read</div>
      </CardContent>
    </Card>
    <Card 
      className="min-w-[180px] flex-1 cursor-pointer border-yellow-300 hover:shadow-lg hover:border-yellow-400 duration-100" 
      onClick={onFavoritesClick}
      tabIndex={0}
      aria-label="View favorite books"
      style={{ outline: 'none' }}
      data-testid="favorites-books-tile"
    >
      <CardContent className="p-2 text-center flex flex-col items-center">
        <div className="flex items-center gap-1 justify-center">
          <Star className="text-yellow-400" size={18} fill="#facc15" />
          <span className="text-lg font-bold text-yellow-700" data-testid="favorites-books">{favorites}</span>
        </div>
        <div className="text-xs text-yellow-600 truncate">Favorites</div>
      </CardContent>
    </Card>
  </div>
);

