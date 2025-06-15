
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Book } from '@/types/book';
import { Trash2, CheckCircle, Star, Bookmark } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onStatusChange: (id: string, status: Book['status']) => void;
  onDelete: (id: string) => void;
  onToggleFavorite?: (id: string) => void; // NEW
}

export const BookCard: React.FC<BookCardProps & { _favoritesCard?: boolean }> = ({
  book, onStatusChange, onDelete, onToggleFavorite, _favoritesCard
}) => {
  // Only show favorite bookmark in standard (non-favorites) card, beside title
  // Never show favorite button in simplified favorites card

  return (
    <Card className={`h-full flex flex-col${_favoritesCard ? " border-yellow-200" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg flex items-center gap-2 text-gray-900" data-testid="book-title">
              {book.title}
            </CardTitle>
            {/* Favorite button: ONLY SHOW on normal (non-favorites) cards */}
            {!_favoritesCard && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onToggleFavorite?.(book._id!)}
                aria-label={book.isFavorite ? "Unmark as favorite" : "Mark as favorite"}
                className="p-2 hover:bg-yellow-100 transition"
                data-testid="favorite-bookmark-btn"
                type="button"
              >
                <Bookmark
                  size={20}
                  stroke={book.isFavorite ? "#eab308" : "#d1d5db"}
                  fill={book.isFavorite ? "#eab308" : "none"}
                  className={book.isFavorite ? "text-yellow-500" : "text-gray-300"}
                />
              </Button>
            )}
          </div>
          <p className="text-gray-600 text-sm mb-1" data-testid="book-author">by {book.author}</p>
          <Badge className={`${book.status === 'not-read'
            ? 'bg-gray-100 text-gray-800'
            : book.status === 'reading'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-green-100 text-green-800'
            } mt-1 mb-0 w-fit text-xs font-semibold`}>
            {book.status === 'not-read' ? '📚' : book.status === 'reading' ? '📖' : '✅'} {book.status.replace('-', ' ').toUpperCase()}
          </Badge>
        </div>
        {/* Actions only in non-favorites card */}
        {!_favoritesCard && (
          <div className="flex flex-col gap-2 items-center ml-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onStatusChange(book._id!, book.status === 'finished' ? 'not-read' : 'finished')}
              aria-label={book.status === 'finished' ? "Mark as not finished" : "Mark as finished"}
              className="p-2 hover:bg-gray-100"
            >
              <CheckCircle className={book.status === 'finished' ? "text-green-600" : "text-gray-300"} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(book._id!)}
              aria-label="Delete book"
              className="p-2 hover:bg-red-100 text-red-400"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </CardHeader>
      {/* Content: if minimal/favorites card, simplify */}
      <CardContent>
        {_favoritesCard ? (
          <div className="flex flex-col justify-center items-start py-2 gap-1">
            <div className="text-gray-500 text-xs">Year: <span className="text-gray-900">{book.publicationYear || 'N/A'}</span></div>
            <div className="text-gray-500 text-xs">Rating: <span className="text-gray-900">{book.rating ? `⭐ ${book.rating}/5` : 'Not rated'}</span></div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              {/* Explicitly render status controls if not favorites card */}
              <Button
                variant={book.status === 'not-read' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onStatusChange(book._id!, 'not-read')}
              >
                Not Read
              </Button>
              <Button
                variant={book.status === 'reading' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onStatusChange(book._id!, 'reading')}
              >
                Reading
              </Button>
              <Button
                variant={book.status === 'finished' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onStatusChange(book._id!, 'finished')}
              >
                Finished
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-500">Publication Year:</span>
                <p className="text-gray-900 font-medium" data-testid="book-year">
                  {book.publicationYear ? `📅 ${book.publicationYear}` : 'Not specified'}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Rating:</span>
                <p className="text-gray-900 font-medium" data-testid="book-rating">
                  {book.rating ? `⭐ ${book.rating}/5` : 'Not rated'}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
