
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
    setLoading(true);
    try {
      console.log('Loading books from API...');
      const booksData = await apiService.getBooks();
      console.log('Books loaded:', booksData);
      setBooks(booksData);
    } catch (error) {
      console.error('Failed to load books:', error);
      toast({ 
        title: 'Failed to load books', 
        description: 'Please try refreshing the page',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (newBook: Omit<Book, '_id'>) => {
    setLoading(true);
    try {
      console.log('Adding book to API:', newBook);
      const createdBook = await apiService.createBook(newBook);
      console.log('Book created:', createdBook);
      setBooks(prevBooks => [...prevBooks, createdBook]);
      toast({ title: 'Book added successfully!' });
    } catch (error) {
      console.error('Failed to add book:', error);
      toast({ 
        title: 'Failed to add book', 
        description: 'Please try again',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: Book['status']) => {
    try {
      console.log('Updating book status:', { id, status });
      const updatedBook = await apiService.updateBook(id, { status });
      console.log('Book status updated:', updatedBook);
      setBooks(prevBooks => 
        prevBooks.map(book => 
          book._id === id ? { ...book, status } : book
        )
      );
      toast({ title: 'Book status updated!' });
    } catch (error) {
      console.error('Failed to update status:', error);
      toast({ 
        title: 'Failed to update status', 
        description: 'Please try again',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteBook = async (id: string) => {
    try {
      console.log('Deleting book:', id);
      await apiService.deleteBook(id);
      console.log('Book deleted successfully');
      setBooks(prevBooks => prevBooks.filter(book => book._id !== id));
      toast({ title: 'Book deleted successfully!' });
    } catch (error) {
      console.error('Failed to delete book:', error);
      toast({ 
        title: 'Failed to delete book', 
        description: 'Please try again',
        variant: 'destructive'
      });
    }
  };

  const notReadBooks = books.filter(book => book.status === 'not-read');
  const readingBooks = books.filter(book => book.status === 'reading');
  const finishedBooks = books.filter(book => book.status === 'finished');

  if (loading && books.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading your library...</div>
      </div>
    );
  }

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
