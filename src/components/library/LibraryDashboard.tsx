
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Book } from '@/types/book';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { AddBookForm } from './AddBookForm';
import { LibrarySection } from './LibrarySection';
import { toast } from '@/hooks/use-toast';
import { LogOut, Library } from 'lucide-react';

export const LibraryDashboard: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      // For demo purposes, using localStorage
      const savedBooks = localStorage.getItem('books');
      if (savedBooks) {
        setBooks(JSON.parse(savedBooks));
      }
    } catch (error) {
      console.error('Failed to load books:', error);
    }
  };

  const saveBooks = (updatedBooks: Book[]) => {
    localStorage.setItem('books', JSON.stringify(updatedBooks));
    setBooks(updatedBooks);
  };

  const handleAddBook = async (newBook: Omit<Book, '_id'>) => {
    setLoading(true);
    try {
      const bookWithId = {
        ...newBook,
        _id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const updatedBooks = [...books, bookWithId];
      saveBooks(updatedBooks);
      toast({ title: 'Book added successfully!' });
    } catch (error) {
      toast({ 
        title: 'Failed to add book', 
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: Book['status']) => {
    try {
      const updatedBooks = books.map(book =>
        book._id === id ? { ...book, status, updatedAt: new Date() } : book
      );
      saveBooks(updatedBooks);
      toast({ title: 'Book status updated!' });
    } catch (error) {
      toast({ 
        title: 'Failed to update status', 
        variant: 'destructive'
      });
    }
  };

  const handleDeleteBook = async (id: string) => {
    try {
      const updatedBooks = books.filter(book => book._id !== id);
      saveBooks(updatedBooks);
      toast({ title: 'Book deleted successfully!' });
    } catch (error) {
      toast({ 
        title: 'Failed to delete book', 
        variant: 'destructive'
      });
    }
  };

  const notReadBooks = books.filter(book => book.status === 'not-read');
  const readingBooks = books.filter(book => book.status === 'reading');
  const finishedBooks = books.filter(book => book.status === 'finished');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Library className="w-8 h-8 text-primary mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">My Library</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <Button variant="outline" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <AddBookForm onAddBook={handleAddBook} loading={loading} />

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Books ({books.length})</TabsTrigger>
              <TabsTrigger value="not-read">Not Read ({notReadBooks.length})</TabsTrigger>
              <TabsTrigger value="reading">Reading ({readingBooks.length})</TabsTrigger>
              <TabsTrigger value="finished">Finished ({finishedBooks.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-8">
              <LibrarySection
                title="Not Read"
                books={notReadBooks}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteBook}
              />
              <LibrarySection
                title="Currently Reading"
                books={readingBooks}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteBook}
              />
              <LibrarySection
                title="Finished"
                books={finishedBooks}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteBook}
              />
            </TabsContent>

            <TabsContent value="not-read">
              <LibrarySection
                title="Not Read"
                books={notReadBooks}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteBook}
              />
            </TabsContent>

            <TabsContent value="reading">
              <LibrarySection
                title="Currently Reading"
                books={readingBooks}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteBook}
              />
            </TabsContent>

            <TabsContent value="finished">
              <LibrarySection
                title="Finished"
                books={finishedBooks}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteBook}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};
