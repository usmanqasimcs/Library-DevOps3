
import React from 'react';
import { Book } from '@/types/book';
import { BookCard } from './BookCard';

interface LibrarySectionProps {
  title: string;
  books: Book[];
  onStatusChange: (id: string, status: Book['status']) => void;
  onDelete: (id: string) => void;
}

export const LibrarySection: React.FC<LibrarySectionProps> = ({
  title,
  books,
  onStatusChange,
  onDelete,
}) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">{title}</h2>
      {books.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No books in this section</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
