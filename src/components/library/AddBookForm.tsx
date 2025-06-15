import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Book } from '@/types/book';

interface AddBookFormProps {
  onAddBook: (book: Omit<Book, '_id'>) => void;
  loading: boolean;
}

export const AddBookForm: React.FC<AddBookFormProps> = ({ onAddBook, loading }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publicationYear, setPublicationYear] = useState<number | ''>('');
  const [rating, setRating] = useState<number | ''>('');
  const [status, setStatus] = useState<Book['status']>('not-read');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && author.trim()) {
      const book: Omit<Book, '_id'> = {
        title: title.trim(),
        author: author.trim(),
        status,
        publicationYear: publicationYear === '' ? undefined : Number(publicationYear),
        rating: rating === '' ? undefined : Number(rating),
      };
      onAddBook(book);
      setTitle('');
      setAuthor('');
      setPublicationYear('');
      setRating('');
      setStatus('not-read');
    }
  };

  return (
    <Card className="bg-white border border-slate-200 shadow-xl rounded-2xl">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-white rounded-t-2xl border-b border-slate-100">
        <CardTitle className="text-gray-900 text-2xl font-extrabold tracking-tight py-1">✨ Add New Book</CardTitle>
      </CardHeader>
      <CardContent className="p-7">
        <form onSubmit={handleSubmit} className="space-y-7">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <Label htmlFor="title" className="text-gray-800 font-medium">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter book title"
                required
                className="bg-white border border-slate-200 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="author" className="text-gray-800 font-medium">Author *</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Enter author name"
                required
                className="bg-white border border-slate-200 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="publicationYear" className="text-gray-800 font-medium">Publication Year</Label>
              <Input
                id="publicationYear"
                type="number"
                inputMode="numeric"
                value={publicationYear}
                onChange={(e) => setPublicationYear(e.target.value ? Number(e.target.value) : '')}
                placeholder="e.g. 2020"
                min={1000}
                max={2030}
                className="bg-white border border-slate-200 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="rating" className="text-gray-800 font-medium">Rating (1-5)</Label>
              <Input
                id="rating"
                type="number"
                inputMode="numeric"
                value={rating}
                onChange={(e) => setRating(e.target.value ? Number(e.target.value) : '')}
                placeholder="Rate 1-5 stars"
                min={1}
                max={5}
                className="bg-white border border-slate-200 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status" className="text-gray-800 font-medium">Status</Label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as Book['status'])}
              className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-purple-500 focus:ring-purple-500"
            >
              <option value="not-read">📚 Not Read</option>
              <option value="reading">📖 Reading</option>
              <option value="finished">✅ Finished</option>
            </select>
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg text-lg shadow-sm transition-all duration-200 transform hover:scale-105"
          >
            {loading ? '✨ Adding...' : '🚀 Add Book to Library'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
