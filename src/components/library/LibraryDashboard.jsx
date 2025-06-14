
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import { LogOut, Library, Plus, ChevronDown, ChevronUp, Trash2, Search, Filter, BookOpen, Edit, Save, X } from 'lucide-react';

export const LibraryDashboard = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedBookId, setExpandedBookId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('title');
  const [editingBookId, setEditingBookId] = useState(null);
  const [editingBook, setEditingBook] = useState({});
  const { user, logout } = useAuth();

  // Form state for adding books
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    status: 'not-read',
    genre: '',
    publicationYear: '',
    pages: '',
    notes: '',
    rating: ''
  });

  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {
    filterAndSortBooks();
  }, [books, searchTerm, filterStatus, sortBy]);

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

  const filterAndSortBooks = () => {
    let filtered = books.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (book.genre && book.genre.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesFilter = filterStatus === 'all' || book.status === filterStatus;
      return matchesSearch && matchesFilter;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'author':
          return a.author.localeCompare(b.author);
        case 'year':
          return (b.publicationYear || 0) - (a.publicationYear || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

    setFilteredBooks(filtered);
  };

  const handleAddBook = async (e) => {
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
        ...(newBook.pages && { pages: parseInt(newBook.pages) }),
        ...(newBook.notes && { notes: newBook.notes.trim() }),
        ...(newBook.rating && { rating: parseInt(newBook.rating) })
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
        pages: '',
        notes: '',
        rating: ''
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

  const handleUpdateBook = async (id) => {
    try {
      console.log('Updating book:', id, editingBook);
      const updatedBook = await apiService.updateBook(id, editingBook);
      console.log('Book updated successfully');
      setBooks(prevBooks => prevBooks.map(book => 
        book._id === id ? { ...book, ...editingBook } : book
      ));
      setEditingBookId(null);
      setEditingBook({});
      toast({ title: 'Book updated successfully!' });
    } catch (error) {
      console.error('Failed to update book:', error);
      toast({ 
        title: 'Failed to update book', 
        description: 'Please try again',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteBook = async (id) => {
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

  const startEditing = (book) => {
    setEditingBookId(book._id);
    setEditingBook({ ...book });
  };

  const cancelEditing = () => {
    setEditingBookId(null);
    setEditingBook({});
  };

  const toggleBookDetails = (id) => {
    setExpandedBookId(expandedBookId === id ? null : id);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'reading':
        return 'bg-blue-100 text-blue-800';
      case 'finished':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setSortBy('title');
  };

  const getBookStats = () => {
    const total = books.length;
    const reading = books.filter(book => book.status === 'reading').length;
    const finished = books.filter(book => book.status === 'finished').length;
    const notRead = books.filter(book => book.status === 'not-read').length;
    return { total, reading, finished, notRead };
  };

  const stats = getBookStats();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="loading-screen">
        <div className="text-lg">Loading your library...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" data-testid="library-dashboard">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Library className="w-8 h-8 text-primary mr-3" data-testid="library-icon" />
              <h1 className="text-2xl font-bold text-gray-900" data-testid="page-title">My Library</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600" data-testid="welcome-message">Welcome, {user?.name}</span>
              <Button variant="outline" onClick={logout} data-testid="logout-button">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4" data-testid="stats-section">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-gray-900" data-testid="total-books">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Books</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600" data-testid="reading-books">{stats.reading}</div>
                <div className="text-sm text-gray-600">Currently Reading</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600" data-testid="finished-books">{stats.finished}</div>
                <div className="text-sm text-gray-600">Finished</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-gray-600" data-testid="unread-books">{stats.notRead}</div>
                <div className="text-sm text-gray-600">Not Read</div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter Section */}
          <Card data-testid="search-filter-section">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Search & Filter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search Books</label>
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by title, author, or genre"
                    data-testid="search-input"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Filter by Status</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    data-testid="status-filter"
                  >
                    <option value="all">All Books</option>
                    <option value="not-read">Not Read</option>
                    <option value="reading">Reading</option>
                    <option value="finished">Finished</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort by</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    data-testid="sort-select"
                  >
                    <option value="title">Title</option>
                    <option value="author">Author</option>
                    <option value="year">Publication Year</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium invisible">Actions</label>
                  <Button 
                    variant="outline" 
                    onClick={clearFilters} 
                    className="w-full"
                    data-testid="clear-filters-button"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add Book Section */}
          <Card data-testid="add-book-section">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Add New Book</CardTitle>
                <Button onClick={() => setShowAddForm(!showAddForm)} data-testid="toggle-add-form">
                  <Plus className="w-4 h-4 mr-2" />
                  {showAddForm ? 'Cancel' : 'Add Book'}
                </Button>
              </div>
            </CardHeader>
            {showAddForm && (
              <CardContent data-testid="add-book-form">
                <form onSubmit={handleAddBook} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Title *</label>
                      <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={newBook.title}
                        onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                        placeholder="Enter book title"
                        required
                        data-testid="title-input"
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
                        data-testid="author-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Genre</label>
                      <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={newBook.genre}
                        onChange={(e) => setNewBook({...newBook, genre: e.target.value})}
                        placeholder="Enter genre"
                        data-testid="genre-input"
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
                        data-testid="year-input"
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
                        data-testid="pages-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Rating (1-5)</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={newBook.rating}
                        onChange={(e) => setNewBook({...newBook, rating: e.target.value})}
                        placeholder="Rate 1-5"
                        data-testid="rating-input"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Status</label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={newBook.status}
                        onChange={(e) => setNewBook({...newBook, status: e.target.value})}
                        data-testid="status-input"
                      >
                        <option value="not-read">Not Read</option>
                        <option value="reading">Reading</option>
                        <option value="finished">Finished</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Notes</label>
                      <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={newBook.notes}
                        onChange={(e) => setNewBook({...newBook, notes: e.target.value})}
                        placeholder="Personal notes"
                        data-testid="notes-input"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" data-testid="submit-book-button">
                    Add Book to Library
                  </Button>
                </form>
              </CardContent>
            )}
          </Card>

          {/* Books List */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800" data-testid="books-list-title">
                Your Books ({filteredBooks.length})
              </h2>
            </div>
            
            {filteredBooks.length === 0 ? (
              <Card data-testid="empty-library">
                <CardContent className="text-center py-12">
                  <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-lg text-muted-foreground">
                    {books.length === 0 ? 'Your library is empty' : 'No books match your search criteria'}
                  </p>
                  <p className="text-muted-foreground">
                    {books.length === 0 ? 'Add some books to get started!' : 'Try adjusting your search or filters'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4" data-testid="books-list">
                {filteredBooks.map((book) => (
                  <Card key={book._id} className="transition-all duration-200 hover:shadow-md" data-testid={`book-card-${book._id}`}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          {editingBookId === book._id ? (
                            <div className="space-y-2">
                              <input
                                className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm font-semibold"
                                value={editingBook.title || ''}
                                onChange={(e) => setEditingBook({...editingBook, title: e.target.value})}
                                data-testid="edit-title-input"
                              />
                              <input
                                className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                                value={editingBook.author || ''}
                                onChange={(e) => setEditingBook({...editingBook, author: e.target.value})}
                                data-testid="edit-author-input"
                              />
                            </div>
                          ) : (
                            <>
                              <CardTitle className="text-lg" data-testid="book-title">{book.title}</CardTitle>
                              <p className="text-muted-foreground" data-testid="book-author">by {book.author}</p>
                            </>
                          )}
                          <div className="flex gap-2 mt-2">
                            <Badge className={`${getStatusColor(book.status)} w-fit`} data-testid="book-status">
                              {book.status.replace('-', ' ')}
                            </Badge>
                            {book.rating && (
                              <Badge variant="outline" data-testid="book-rating">
                                ★ {book.rating}/5
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {editingBookId === book._id ? (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUpdateBook(book._id)}
                                data-testid="save-edit-button"
                              >
                                <Save className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={cancelEditing}
                                data-testid="cancel-edit-button"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => startEditing(book)}
                              data-testid="edit-book-button"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleBookDetails(book._id)}
                            data-testid="toggle-details-button"
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
                            onClick={() => handleDeleteBook(book._id)}
                            data-testid="delete-book-button"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    {expandedBookId === book._id && (
                      <CardContent className="pt-0" data-testid="book-details">
                        <div className="border-t pt-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-600">Genre:</span>
                              <p data-testid="book-genre">{book.genre || 'N/A'}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-600">Publication Year:</span>
                              <p data-testid="book-year">{book.publicationYear || 'N/A'}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-600">Pages:</span>
                              <p data-testid="book-pages">{book.pages || 'N/A'}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-600">Status:</span>
                              <p className="capitalize" data-testid="book-status-detail">{book.status.replace('-', ' ')}</p>
                            </div>
                          </div>
                          {book.notes && (
                            <div className="mt-4">
                              <span className="font-medium text-gray-600">Notes:</span>
                              <p className="mt-1 text-sm" data-testid="book-notes">{book.notes}</p>
                            </div>
                          )}
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
