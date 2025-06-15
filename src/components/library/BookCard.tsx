import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Book } from '@/types/book';
import { Trash2, CheckCircle, Star } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onStatusChange: (id: string, status: Book['status']) => void;
  onDelete: (id: string) => void;
}

export const BookCard: React.FC<BookCardProps & { _favoritesCard?: boolean }> = ({
  book, onStatusChange, onDelete, _favoritesCard
}) => {
  // Show star only in ONE place: with title in non-favorite card; never again
  // _favoritesCard: minimal display for favorites tab

  return (
    <Card className={`h-full flex flex-col${_favoritesCard ? " border-yellow-200" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2 text-gray-900" data-testid="book-title">
              {book.title}
              {/* Only show favorite star on standard card mode, NOT on minimal favorites card */}
              {!_favoritesCard && !!book.isFavorite && (
                <span className="inline-block text-yellow-500" data-testid="favorite-star">
                  <Star size={18} fill="#eab308" stroke="#f59e0b" />
                </span>
              )}
            </CardTitle>
            <p className="text-gray-600 mt-1 mb-1 text-base" data-testid="book-author">
              by {book.author}
            </p>
            <Badge className={`${book.status === 'not-read'
                ? 'bg-gray-100 text-gray-800'
                : book.status === 'reading'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-green-100 text-green-800'
              } mt-1 mb-0 w-fit`}>
              {book.status === 'not-read' ? '📚' : book.status === 'reading' ? '📖' : '✅'} {book.status.replace('-', ' ').toUpperCase()}
            </Badge>
          </div>
          {/* Action buttons: only in normal mode, not in favorites card */}
          {!_favoritesCard && (
            <div className="flex flex-col gap-2 items-center ml-4">
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
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {/* Only show status controls in non-favorite mode */}
          {!_favoritesCard && (
            <div className="flex flex-wrap gap-2">
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
          )}
          {/* Book details, rating/year - always visible */}
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
      </CardContent>
    </Card>
  );
};
