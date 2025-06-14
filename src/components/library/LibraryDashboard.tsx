
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Book } from '@/types/book';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import { LogOut, Library, Plus, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';

export const LibraryDashboard: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedBookId, setExpandedBookId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const { user, logout } = useAuth();

  // Form state for adding books
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    status: 'not-read' as Book['status'],
    genre: '',
    publicationYear: '',
    pages: ''
  });

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

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBook.title.trim() || !newBook.author.trim()) {
      toast({ 
        title: 'Missing information', 
        description: 'Please fill in title and author',
        variant: 'destructive'
      });
      return;
    }

    try {
      console.log('Adding book to API:', newBook);
      const bookToAdd = {
        title: newBook.title.trim(),
        author: newBook.author.trim(),
        status: newBook.status,
        ...(newBook.genre && { genre: newBook.genre.trim() }),
        ...(newBook.publicationYear && { publicationYear: parseInt(newBook.publicationYear) }),
        ...(newBook.pages && { pages: parseInt(newBook.pages) })
      };
      
      const createdBook = await apiService.createBook(bookToAdd);
      console.log('Book created:', createdBook);
      setBooks(prevBooks => [...prevBooks, createdBook]);
      setNewBook({
        title: '',
        author: '',
        status: 'not-read',
        genre: '',
        publicationYear: '',
        pages: ''
      });
      setShowAddForm(false);
      toast({ title: 'Book added successfully!' });
    } catch (error) {
      console.error('Failed to add book:', error);
      toast({ 
        title: 'Failed to add book', 
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
      setExpandedBookId(null);
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

  const toggleBookDetails = (id: string) => {
    setExpandedBookId(expandedBookId === id ? null : id);
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

  if (loading) {
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
          {/* Add Book Section */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Add New Book</CardTitle>
                <Button onClick={() => setShowAddForm(!showAddForm)}>
                  <Plus className="w-4 h-4 mr-2" />
                  {showAddForm ? 'Cancel' : 'Add Book'}
                </Button>
              </div>
            </CardHeader>
            {showAddForm && (
              <CardContent>
                <form onSubmit={handleAddBook} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Title *</label>
                      <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={newBook.title}
                        onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                        placeholder="Enter book title"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Author *</label>
                      <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={newBook.author}
                        onChange={(e) => setNewBook({...newBook, author: e.target.value})}
                        placeholder="Enter author name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Genre</label>
                      <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={newBook.genre}
                        onChange={(e) => setNewBook({...newBook, genre: e.target.value})}
                        placeholder="Enter genre"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Publication Year</label>
                      <input
                        type="number"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={newBook.publicationYear}
                        onChange={(e) => setNewBook({...newBook, publicationYear: e.target.value})}
                        placeholder="Enter year"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Pages</label>
                      <input
                        type="number"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={newBook.pages}
                        onChange={(e) => setNewBook({...newBook, pages: e.target.value})}
                        placeholder="Number of pages"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Status</label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={newBook.status}
                        onChange={(e) => setNewBook({...newBook, status: e.target.value as Book['status']})}
                      >
                        <option value="not-read">Not Read</option>
                        <option value="reading">Reading</option>
                        <option value="finished">Finished</option>
                      </select>
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    Add Book to Library
                  </Button>
                </form>
              </CardContent>
            )}
          </Card>

          {/* Books List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">Your Books ({books.length})</h2>
            {books.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Library className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-lg text-muted-foreground">Your library is empty</p>
                  <p className="text-muted-foreground">Add some books to get started!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {books.map((book) => (
                  <Card key={book._id} className="transition-all duration-200 hover:shadow-md">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{book.title}</CardTitle>
                          <p className="text-muted-foreground">by {book.author}</p>
                          <Badge className={`${getStatusColor(book.status)} mt-2 w-fit`}>
                            {book.status.replace('-', ' ')}
                          </Badge>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleBookDetails(book._id!)}
                          >
                            {expandedBookId === book._id ? (
                              <>
                                <ChevronUp className="w-4 h-4 mr-1" />
                                Hide Details
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-4 h-4 mr-1" />
                                View Details
                              </>
                            )}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteBook(book._id!)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    {expandedBookId === book._id && (
                      <CardContent className="pt-0">
                        <div className="border-t pt-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-600">Genre:</span>
                              <p>{(book as any).genre || 'N/A'}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-600">Publication Year:</span>
                              <p>{(book as any).publicationYear || 'N/A'}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-600">Pages:</span>
                              <p>{(book as any).pages || 'N/A'}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-600">Status:</span>
                              <p className="capitalize">{book.status.replace('-', ' ')}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
