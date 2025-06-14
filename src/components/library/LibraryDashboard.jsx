import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import { LogOut, Library, Plus, ChevronDown, ChevronUp, Trash2, Search, Filter, BookOpen, Edit, Save, X, Star, StarOff } from 'lucide-react';
import { SearchBar } from "./SearchBar";
import { BulkMarkFinished } from "./BulkMarkFinished";

export const LibraryDashboard = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedBookId, setExpandedBookId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [editingBookId, setEditingBookId] = useState(null);
  const [editingBook, setEditingBook] = useState({});
  const { user, logout } = useAuth();
  const [favoriteBookIds, setFavoriteBookIds] = useState(new Set());

  // Simplified form state for adding books
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    status: 'not-read'
  });

  // New state for bulk action (this must be declared before any return)
  const [selectedNotReadIds, setSelectedNotReadIds] = useState(new Set());

  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {
    filterAndSortBooks();
  }, [books, searchTerm, sortBy, favoriteBookIds]);

  const filterAndSortBooks = () => {
    let filtered = [...books];
    
    // Apply search filter
    if (searchTerm && searchTerm.trim() !== '') {
      const term = searchTerm.trim().toLowerCase();
      filtered = filtered.filter(book =>
        (book.title && book.title.toLowerCase().includes(term)) ||
        (book.author && book.author.toLowerCase().includes(term)) ||
        (book.publicationYear && book.publicationYear.toString() === term)
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'author':
          return a.author.localeCompare(b.author);
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });
    
    setFilteredBooks(filtered);
  };

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
        status: newBook.status
      };
      
      const createdBook = await apiService.createBook(bookToAdd);
      console.log('Book created:', createdBook);
      setBooks(prevBooks => [...prevBooks, createdBook]);
      setNewBook({
        title: '',
        author: '',
        status: 'not-read'
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
    setSortBy('title');
  };

  const getBookStats = () => {
    const total = books.length;
    const reading = books.filter(book => book.status === 'reading').length;
    const finished = books.filter(book => book.status === 'finished').length;
    const notRead = books.filter(book => book.status === 'not-read').length;
    return { total, reading, finished, notRead };
  };

  const getBooksByStatus = (status) => {
    // Always place favorite books at the top within each status section
    const booksInStatus = filteredBooks.filter(book => book.status === status);
    return [
      ...booksInStatus.filter(book => favoriteBookIds.has(book._id)),
      ...booksInStatus.filter(book => !favoriteBookIds.has(book._id)),
    ];
  };

  const toggleFavorite = (id) => {
    setFavoriteBookIds(prev => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      return updated;
    });
  };

  const renderSearchBar = () => (
    <div className="w-full mb-4 flex items-center" data-testid="search-bar-container">
      <div className="relative w-full max-w-md">
        <input
          type="text"
          className="block w-full rounded-md border border-input bg-background py-2 pl-10 pr-4 text-base md:text-sm"
          placeholder="🔍 Search by title, author, or year..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          data-testid="search-bar"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <Search size={18} />
        </span>
      </div>
    </div>
  );

  const renderBookCard = (book) => {
    const isFavorite = favoriteBookIds.has(book._id);

    return (
      <Card
        key={book._id}
        className={`transition-all duration-200 hover:shadow-md relative border-2 ${isFavorite ? 'border-yellow-400' : ''}`}
        data-testid={`book-card-${book._id}`}
      >
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
                  <select
                    className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                    value={editingBook.status || ''}
                    onChange={(e) => setEditingBook({...editingBook, status: e.target.value})}
                    data-testid="edit-status-select"
                  >
                    <option value="not-read">Not Read</option>
                    <option value="reading">Reading</option>
                    <option value="finished">Finished</option>
                  </select>
                </div>
              ) : (
                <>
                  <CardTitle className="text-lg flex items-center gap-2" data-testid="book-title">
                    {book.title}
                    {isFavorite && (
                      <span className="inline-block text-yellow-500" data-testid="favorite-star">
                        <Star size={16} fill="#facc15" stroke="#fde047" />
                      </span>
                    )}
                  </CardTitle>
                  <p className="text-muted-foreground" data-testid="book-author">by {book.author}</p>
                </>
              )}
              {!editingBookId === book._id && book.rating && (
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline" data-testid="book-rating">
                    ★ {book.rating}/5
                  </Badge>
                </div>
              )}
            </div>
            <div className="flex space-x-2 items-center">
              {/* Favorite toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleFavorite(book._id)}
                aria-label={isFavorite ? "Unfavorite book" : "Mark as favorite"}
                className="p-0"
                data-testid="favorite-toggle"
              >
                {isFavorite 
                  ? <Star size={20} fill="#facc15" stroke="#fde047" /> 
                  : <StarOff size={20} className="text-gray-400" />}
              </Button>
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
                    Hide
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-1" />
                    Details
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
            {editingBookId === book._id ? (
              <div className="border-t pt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Genre</label>
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={editingBook.genre || ''}
                      onChange={(e) => setEditingBook({...editingBook, genre: e.target.value})}
                      placeholder="Enter genre"
                      data-testid="edit-genre-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Publication Year</label>
                    <input
                      type="number"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={editingBook.publicationYear || ''}
                      onChange={(e) => setEditingBook({...editingBook, publicationYear: parseInt(e.target.value)})}
                      placeholder="Enter year"
                      data-testid="edit-year-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Pages</label>
                    <input
                      type="number"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={editingBook.pages || ''}
                      onChange={(e) => setEditingBook({...editingBook, pages: parseInt(e.target.value)})}
                      placeholder="Number of pages"
                      data-testid="edit-pages-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Rating (1-5)</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={editingBook.rating || ''}
                      onChange={(e) => setEditingBook({...editingBook, rating: parseInt(e.target.value)})}
                      placeholder="Rate 1-5"
                      data-testid="edit-rating-input"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Notes</label>
                  <textarea
                    className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={editingBook.notes || ''}
                    onChange={(e) => setEditingBook({...editingBook, notes: e.target.value})}
                    placeholder="Personal notes"
                    data-testid="edit-notes-input"
                  />
                </div>
              </div>
            ) : (
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
                    <span className="font-medium text-gray-600">Rating:</span>
                    <p data-testid="book-rating-detail">{book.rating ? `★ ${book.rating}/5` : 'N/A'}</p>
                  </div>
                </div>
                {book.notes && (
                  <div className="mt-4">
                    <span className="font-medium text-gray-600">Notes:</span>
                    <p className="mt-1 text-sm" data-testid="book-notes">{book.notes}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        )}
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="loading-screen">
        <div className="text-lg">Loading your library...</div>
      </div>
    );
  }

  // FIX: Define stats here
  const stats = getBookStats();

  // New state for bulk action
  const [selectedNotReadIds, setSelectedNotReadIds] = useState(new Set());

  const handleToggleSelect = (id) => {
    setSelectedNotReadIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulkMarkFinished = async () => {
    if (selectedNotReadIds.size === 0) return;
    let successCount = 0, failCount = 0;
    for (const id of selectedNotReadIds) {
      const bookToUpdate = books.find(b => b._id === id);
      if (!bookToUpdate || bookToUpdate.status === "finished") continue;
      try {
        await apiService.updateBook(id, { ...bookToUpdate, status: "finished" });
        setBooks(prev =>
          prev.map(b => (b._id === id ? { ...b, status: "finished" } : b))
        );
        successCount++;
      } catch {
        failCount++;
      }
    }
    setSelectedNotReadIds(new Set());
    toast({
      title: `Marked ${successCount} book(s) as finished${failCount ? `, ${failCount} failed.` : '.'}`,
      variant: failCount ? "destructive" : "default"
    });
  };

  const notReadBooks = getBooksByStatus('not-read');

  // --- Use the new SearchBar and move icon before input ---
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
              <span className="text-sm text-gray-600" data-testid="welcome-message">Welcome ! </span>
              <Button variant="outline" onClick={logout} data-testid="logout-button">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* --- 1. SEARCH BAR ON TOP --- */}
        <SearchBar value={searchTerm} onChange={setSearchTerm} />

        {/* --- 2. STATISTICS --- */}
        <div
          className="flex gap-2 w-full overflow-x-auto pb-2"
          data-testid="stats-section"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <Card className="min-w-[200px] flex-1">
            <CardContent className="p-2 text-center">
              <div className="text-lg font-bold text-gray-900 truncate" data-testid="total-books">{stats.total}</div>
              <div className="text-xs text-gray-600 truncate">Total Books</div>
            </CardContent>
          </Card>
          <Card className="min-w-[200px] flex-1">
            <CardContent className="p-2 text-center">
              <div className="text-lg font-bold text-blue-600 truncate" data-testid="reading-books">{stats.reading}</div>
              <div className="text-xs text-gray-600 truncate">Currently Reading</div>
            </CardContent>
          </Card>
          <Card className="min-w-[200px] flex-1">
            <CardContent className="p-2 text-center">
              <div className="text-lg font-bold text-green-600 truncate" data-testid="finished-books">{stats.finished}</div>
              <div className="text-xs text-gray-600 truncate">Finished</div>
            </CardContent>
          </Card>
          <Card className="min-w-[200px] flex-1">
            <CardContent className="p-2 text-center">
              <div className="text-lg font-bold text-gray-600 truncate" data-testid="unread-books">{stats.notRead}</div>
              <div className="text-xs text-gray-600 truncate">Not Read</div>
            </CardContent>
          </Card>
        </div>

        {/* --- 3. Add Book Section stays same --- */}
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
                </div>
                <Button type="submit" className="w-full" data-testid="submit-book-button">
                  Add Book to Library
                </Button>
              </form>
            </CardContent>
          )}
        </Card>

        {/* --- 4. Books Sections --- */}
        <div className="space-y-8">
          {/* Not Read Section with Bulk Action */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4" data-testid="not-read-section-title">
              📚 Not Read ({notReadBooks.length})
            </h2>
            {/* Bulk action bar */}
            <BulkMarkFinished
              books={notReadBooks}
              selectedIds={selectedNotReadIds}
              onToggle={() => {}} // Not used in bulk bar, selection is handled below per book
              onBulkMark={handleBulkMarkFinished}
            />
            {notReadBooks.length === 0 ? (
              <Card data-testid="empty-not-read">
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">No books in this section</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="not-read-books">
                {notReadBooks.map((book) => (
                  <div key={book._id} className="relative">
                    {/* Checkbox top-right for bulk select */}
                    <input
                      type="checkbox"
                      className="absolute right-2 top-2 z-10 w-4 h-4 accent-primary"
                      checked={selectedNotReadIds.has(book._id)}
                      onChange={() => handleToggleSelect(book._id)}
                      data-testid={`select-book-${book._id}`}
                    />
                    {renderBookCard(book)}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Currently Reading Section */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4" data-testid="reading-section-title">
              📖 Currently Reading ({getBooksByStatus('reading').length})
            </h2>
            {getBooksByStatus('reading').length === 0 ? (
              <Card data-testid="empty-reading">
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">No books in this section</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="reading-books">
                {getBooksByStatus('reading').map(renderBookCard)}
              </div>
            )}
          </div>

          {/* Finished Section */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4" data-testid="finished-section-title">
              ✅ Finished ({getBooksByStatus('finished').length})
            </h2>
            {getBooksByStatus('finished').length === 0 ? (
              <Card data-testid="empty-finished">
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">No books in this section</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="finished-books">
                {getBooksByStatus('finished').map(renderBookCard)}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
