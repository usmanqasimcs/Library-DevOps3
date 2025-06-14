
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
  const [status, setStatus] = useState<Book['status']>('not-read');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && author.trim()) {
      const book: Omit<Book, '_id'> = {
        title: title.trim(),
        author: author.trim(),
        status,
        publicationYear: publicationYear === '' ? undefined : Number(publicationYear),
      };
      onAddBook(book);
      setTitle('');
      setAuthor('');
      setPublicationYear('');
      setStatus('not-read');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Book</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter book title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Enter author name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="publicationYear">Publication Year</Label>
              <Input
                id="publicationYear"
                type="number"
                inputMode="numeric"
                value={publicationYear}
                onChange={(e) => setPublicationYear(e.target.value ? Number(e.target.value) : '')}
                placeholder="e.g. 2020"
                min={0}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as Book['status'])}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="not-read">Not Read</option>
              <option value="reading">Reading</option>
              <option value="finished">Finished</option>
            </select>
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Adding...' : 'Add Book'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
