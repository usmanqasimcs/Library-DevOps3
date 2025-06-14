
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface LibraryStatsProps {
  total: number;
  reading: number;
  finished: number;
  notRead: number;
}

export const LibraryStats: React.FC<LibraryStatsProps> = ({ total, reading, finished, notRead }) => (
  <div
    className="flex gap-2 w-full overflow-x-auto pb-2"
    data-testid="stats-section"
    style={{ WebkitOverflowScrolling: 'touch' }}
  >
    <Card className="min-w-[200px] flex-1">
      <CardContent className="p-2 text-center">
        <div className="text-lg font-bold text-gray-900 truncate" data-testid="total-books">{total}</div>
        <div className="text-xs text-gray-600 truncate">Total Books</div>
      </CardContent>
    </Card>
    <Card className="min-w-[200px] flex-1">
      <CardContent className="p-2 text-center">
        <div className="text-lg font-bold text-blue-600 truncate" data-testid="reading-books">{reading}</div>
        <div className="text-xs text-gray-600 truncate">Currently Reading</div>
      </CardContent>
    </Card>
    <Card className="min-w-[200px] flex-1">
      <CardContent className="p-2 text-center">
        <div className="text-lg font-bold text-green-600 truncate" data-testid="finished-books">{finished}</div>
        <div className="text-xs text-gray-600 truncate">Finished</div>
      </CardContent>
    </Card>
    <Card className="min-w-[200px] flex-1">
      <CardContent className="p-2 text-center">
        <div className="text-lg font-bold text-gray-600 truncate" data-testid="unread-books">{notRead}</div>
        <div className="text-xs text-gray-600 truncate">Not Read</div>
      </CardContent>
    </Card>
  </div>
);
