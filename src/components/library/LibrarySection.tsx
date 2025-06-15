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
    <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-6 mb-8 transition-all duration-200 hover:shadow-md">
      <div className="flex items-center mb-6">
        <div className="h-1 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mr-4"></div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{title}</h2>
        <div className="ml-4 px-3 py-1 bg-slate-100 rounded-full">
          <span className="text-sm font-medium text-slate-600">{books.length}</span>
        </div>
      </div>
      
      {books.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
          </div>
          <p className="text-slate-500 font-medium mb-1">No books in this section</p>
          <p className="text-slate-400 text-sm">Add some books to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
