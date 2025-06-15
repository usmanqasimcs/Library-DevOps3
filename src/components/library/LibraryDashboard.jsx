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
import { LibraryStats } from "./LibraryStats";
import { AddBookForm } from "./AddBookForm";
import { BooksSection } from "./BooksSection";

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
  const [selectedNotReadIds, setSelectedNotReadIds] = useState(new Set());

  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {
    filterAndSortBooks();
  }, [books, searchTerm, sortBy]);

  const filterAndSortBooks = () => {
    let filtered = Array.isArray(books) ? [...books] : [];
    
    if (searchTerm && searchTerm.trim() !== '') {
      const term = searchTerm.trim().toLowerCase();
      filtered = filtered.filter(book =>
        (book.title && book.title.toLowerCase().includes(term)) ||
        (book.author && book.author.toLowerCase().includes(term)) ||
        (book.publicationYear && book.publicationYear.toString() === term)
      );
    }
    
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
      const arrayData = Array.isArray(booksData) ? booksData : [];
      console.log('Books loaded:', arrayData);
      setBooks(arrayData);
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

  const handleAddBook = async (bookData) => {
    try {
      console.log('Adding book to API:', bookData);
      const createdBook = await apiService.createBook(bookData);
      console.log('Book created:', createdBook);
      setBooks(prevBooks => [...prevBooks, createdBook]);
      setShowAddForm(false);
      toast({ title: '📚 Book added successfully!' });
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
      toast({ title: '✅ Book updated successfully!' });
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
      toast({ title: '🗑️ Book deleted successfully!' });
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
        return 'bg-blue-600 text-blue-100';
      case 'finished':
        return 'bg-green-600 text-green-100';
      default:
        return 'bg-gray-600 text-gray-100';
    }
  };

  const getBookStats = () => {
    const total = books.length;
    const reading = books.filter(book => book.status === 'reading').length;
    const finished = books.filter(book => book.status === 'finished').length;
    const notRead = books.filter(book => book.status === 'not-read').length;
    return { total, reading, finished, notRead };
  };

  const getBooksByStatus = (status) => {
    const list = Array.isArray(filteredBooks) ? filteredBooks : [];
    const booksInStatus = list.filter(book => book.status === status);
    return [
      ...booksInStatus.filter(book => book.isFavorite),
      ...booksInStatus.filter(book => !book.isFavorite),
    ];
  };

  const toggleFavorite = async (id) => {
    try {
      const book = books.find(b => b._id === id);
      if (!book) return;
      
      const updatedBook = await apiService.updateBook(id, { 
        ...book, 
        isFavorite: !book.isFavorite 
      });
      
      setBooks(prevBooks => prevBooks.map(book => 
        book._id === id ? { ...book, isFavorite: !book.isFavorite } : book
      ));
      
      toast({ 
        title: book.isFavorite ? '💫 Removed from favorites' : '⭐ Added to favorites' 
      });
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      toast({ 
        title: 'Failed to update favorite', 
        description: 'Please try again',
        variant: 'destructive'
      });
    }
  };

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
      title: `✅ Marked ${successCount} book(s) as finished${failCount ? `, ${failCount} failed.` : '.'}`,
      variant: failCount ? "destructive" : "default"
    });
  };

  const renderBookCard = (book) => {
    const isFavorite = book.isFavorite;

    return (
      <Card
        key={book._id}
        className={`transition-all duration-300 hover:shadow-2xl relative border-2 bg-white/95 backdrop-blur-sm ${
          isFavorite 
            ? 'border-yellow-400 shadow-yellow-400/20' 
            : 'border-gray-300 hover:border-blue-500'
        }`}
        data-testid={`book-card-${book._id}`}
      >
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              {editingBookId === book._id ? (
                <div className="space-y-3">
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 focus:border-blue-500"
                    value={editingBook.title || ''}
                    onChange={(e) => setEditingBook({...editingBook, title: e.target.value})}
                    placeholder="Book title"
                    data-testid="edit-title-input"
                  />
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500"
                    value={editingBook.author || ''}
                    onChange={(e) => setEditingBook({...editingBook, author: e.target.value})}
                    placeholder="Author name"
                    data-testid="edit-author-input"
                  />
                  <select
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500"
                    value={editingBook.status || ''}
                    onChange={(e) => setEditingBook({...editingBook, status: e.target.value})}
                    data-testid="edit-status-select"
                  >
                    <option value="not-read">📚 Not Read</option>
                    <option value="reading">📖 Reading</option>
                    <option value="finished">✅ Finished</option>
                  </select>
                </div>
              ) : (
                <>
                  <CardTitle className="text-lg flex items-center gap-2 text-gray-900" data-testid="book-title">
                    {book.title}
                    {isFavorite && (
                      <span className="inline-block text-yellow-500" data-testid="favorite-star">
                        <Star size={16} fill="#eab308" stroke="#f59e0b" />
                      </span>
                    )}
                  </CardTitle>
                  <p className="text-gray-600 mt-1" data-testid="book-author">by {book.author}</p>
                  <Badge className={`${getStatusColor(book.status)} mt-2 w-fit`}>
                    {book.status === 'not-read' ? '📚' : book.status === 'reading' ? '📖' : '✅'} {book.status.replace('-', ' ').toUpperCase()}
                  </Badge>
                </>
              )}
            </div>
            <div className="flex space-x-2 items-center ml-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleFavorite(book._id)}
                aria-label={isFavorite ? "Unfavorite book" : "Mark as favorite"}
                className="p-2 hover:bg-gray-100"
                data-testid="favorite-toggle"
              >
                {isFavorite 
                  ? <Star size={20} fill="#eab308" stroke="#f59e0b" /> 
                  : <StarOff size={20} className="text-gray-400 hover:text-yellow-500" />}
              </Button>
              {editingBookId === book._id ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateBook(book._id)}
                    className="bg-green-600 hover:bg-green-700 border-green-600 text-white"
                    data-testid="save-edit-button"
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={cancelEditing}
                    className="bg-gray-600 hover:bg-gray-700 border-gray-600 text-white"
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
                  className="bg-blue-600 hover:bg-blue-700 border-blue-600 text-blue-900 font-semibold"
                  data-testid="edit-book-button"
                >
                  <Edit className="w-4 h-4" />
                  <span className="ml-1">Edit</span>
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleBookDetails(book._id)}
                className="bg-purple-100 hover:bg-purple-200 border-purple-200 text-purple-900 font-semibold"
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
                className="bg-red-600 hover:bg-red-700"
                data-testid="delete-book-button"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        {expandedBookId === book._id && (
          <CardContent className="pt-0 border-t border-gray-200" data-testid="book-details">
            {editingBookId === book._id ? (
              <div className="pt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Publication Year</label>
                    <input
                      type="number"
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500"
                      value={editingBook.publicationYear || ''}
                      onChange={(e) => setEditingBook({...editingBook, publicationYear: parseInt(e.target.value) || ''})}
                      placeholder="Enter year"
                      min={1000}
                      max={2030}
                      data-testid="edit-year-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Rating (1-5)</label>
                    <input
                      type="number"
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500"
                      value={editingBook.rating || ''}
                      onChange={(e) => setEditingBook({...editingBook, rating: parseInt(e.target.value) || ''})}
                      placeholder="Rate 1-5"
                      min={1}
                      max={5}
                      data-testid="edit-rating-input"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="pt-4">
                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div>
                    <span className="font-medium text-gray-500">Publication Year:</span>
                    <p className="text-gray-900 font-medium" data-testid="book-year">
                      {book.publicationYear ? `📅 ${book.publicationYear}` : 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Rating:</span>
                    <p className="text-gray-900 font-medium" data-testid="book-rating">
                      {book.rating ? `⭐ ${book.rating}/5` : 'Not rated'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200" data-testid="loading-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <div className="text-xl text-gray-900">Loading your library...</div>
        </div>
      </div>
    );
  }

  const stats = getBookStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200" data-testid="library-dashboard">
      <header className="bg-white/90 backdrop-blur-sm shadow-2xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg mr-3">
                <Library className="w-6 h-6 text-white" data-testid="library-icon" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900" data-testid="page-title">My Digital Library</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600" data-testid="welcome-message">
                Welcome, {user?.name || 'Reader'}! 📚
              </span>
              <Button 
                variant="outline" 
                onClick={logout} 
                className="bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-900"
                data-testid="logout-button"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
        
        <LibraryStats
          total={stats.total}
          reading={stats.reading}
          finished={stats.finished}
          notRead={stats.notRead}
        />

        <div className="mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-2xl">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-gray-900 text-xl">✨ Add New Book</CardTitle>
                <Button 
                  onClick={() => setShowAddForm(!showAddForm)} 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  data-testid="toggle-add-form"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {showAddForm ? 'Cancel' : 'Add Book'}
                </Button>
              </div>
            </CardHeader>
            {showAddForm && (
              <CardContent>
                <AddBookForm onAddBook={handleAddBook} loading={false} />
              </CardContent>
            )}
          </Card>
        </div>

        <div className="space-y-8">
          <BooksSection
            title="Not Read"
            books={getBooksByStatus('not-read')}
            type="not-read"
            selectedIds={selectedNotReadIds}
            onToggleSelect={handleToggleSelect}
            onBulkMark={handleBulkMarkFinished}
            renderBookCard={renderBookCard}
          />

          <BooksSection
            title="Currently Reading"
            books={getBooksByStatus('reading')}
            type="reading"
            renderBookCard={renderBookCard}
          />

          <BooksSection
            title="Finished"
            books={getBooksByStatus('finished')}
            type="finished"
            renderBookCard={renderBookCard}
          />
        </div>
      </main>
    </div>
  );
};
