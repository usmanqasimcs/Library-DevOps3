
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Book } from '@/types/book';
import { Trash2, BookOpen, CheckCircle, Circle } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onStatusChange: (id: string, status: Book['status']) => void;
  onDelete: (id: string) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onStatusChange, onDelete }) => {
  const getStatusIcon = (status: Book['status']) => {
    switch (status) {
      case 'reading':
        return <BookOpen className="w-4 h-4" />;
      case 'finished':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Circle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: Book['status']) => {
    switch (status) {
      case 'reading':
        return 'bg-blue-100 text-blue-800';
      case 'finished':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{book.title}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(book._id!)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-muted-foreground">{book.author}</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <Badge className={`${getStatusColor(book.status)} w-fit`}>
            {getStatusIcon(book.status)}
            <span className="ml-1 capitalize">{book.status.replace('-', ' ')}</span>
          </Badge>
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
        </div>
      </CardContent>
    </Card>
  );
};
