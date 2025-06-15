
import React, { useState, useEffect, useRef } from 'react';
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
import { BookCard } from "./BookCard";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";

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

  // For scrolling to favorites
  const favoritesRef = useRef(null);

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
    const favorites = books.filter(book => !!book.isFavorite).length;
    return { total, reading, finished, notRead, favorites };
  };

  const getFavoriteBooks = () => {
    const list = Array.isArray(filteredBooks) ? filteredBooks : [];
    return list.filter(book => book.isFavorite);
  };

  const scrollToFavorites = () => {
    setTimeout(() => {
      if (favoritesRef.current) {
        favoritesRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
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
    // DO NOT add extra favorite icon here.
    // If _favoritesCard is true (favorites tab), BookCard will render it minimally.
    // Otherwise, BookCard itself will handle star logic.
    // Drop any extra <Star> rendering here and just use BookCard, passing _favoritesCard when needed.
    const isFavoriteTabCard = book._favoritesCard === true;

    return (
      <div className="flex h-full min-h-[260px]">
        <BookCard
          book={book}
          onStatusChange={(id, status) => handleUpdateBookStatus(id, status)} // use your own handler
          onDelete={handleDeleteBook}
          _favoritesCard={isFavoriteTabCard}
        />
      </div>
    );
  };

  // Helper function to update book status, if not present yet:
  const handleUpdateBookStatus = async (id, status) => {
    try {
      const book = books.find(b => b._id === id);
      if (!book) return;
      const updatedBook = await apiService.updateBook(id, { ...book, status });
      setBooks(prev => prev.map(b => b._id === id ? { ...b, status: updatedBook.status } : b));
      toast({ title: `Status changed to "${status}"` });
    } catch (e) {
      toast({ title: 'Failed to change status', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50" data-testid="loading-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <div className="text-xl text-gray-900">Loading your library...</div>
        </div>
      </div>
    );
  }

  const sectionBg = "bg-white";
  const borderColor = "border-slate-200";

  const stats = getBookStats();

  return (
    <div className="min-h-screen bg-slate-100" data-testid="library-dashboard">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white shadow border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center h-24 relative">
          {/* Left: Logo and Title */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="p-3 rounded-full shadow bg-purple-700 flex items-center justify-center">
              <Library className="w-8 h-8 text-white" data-testid="library-icon" />
            </div>
            <h1
              className="text-4xl font-extrabold text-purple-800 tracking-tight select-none"
              style={{ letterSpacing: ".01em" }}
              data-testid="page-title"
            >
              My Digital Library
            </h1>
          </div>
          {/* Right: Logout Button flush right and always visible */}
          <div className="flex-1 flex justify-end items-center">
            <Button
              variant="destructive"
              onClick={logout}
              className="px-5 py-2 text-base font-semibold rounded-lg bg-red-600 hover:bg-red-700 border-none text-white shadow transition-colors"
              data-testid="logout-button"
              style={{
                background: '#dc2626',
                color: '#fff'
              }}
            >
              <LogOut className="w-5 h-5 mr-2 text-white" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto w-full px-2 sm:px-6 lg:px-8 py-8">
        {/* ---- Search, Sort, and Stats Row ---- */}
        <div className="flex flex-col gap-8 mb-5 w-full">
          {/* Search & Sort together in Card */}
          <div className="w-full">
            <div className="bg-white rounded-2xl px-6 py-6 shadow-sm mb-4 border border-slate-200 flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1 min-w-0">
                <SearchBar value={searchTerm} onChange={setSearchTerm} />
              </div>
              {/* Sort Select - placed INSIDE the card */}
              <div className="flex-shrink-0 min-w-[170px]">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full md:min-w-[140px]">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Sort By</SelectLabel>
                      <SelectItem value="title">Title</SelectItem>
                      <SelectItem value="author">Author</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          {/* Stats card */}
          <div className="w-full">
            <div className="bg-white rounded-2xl px-3 py-3 shadow-sm border border-slate-200">
              <LibraryStats
                total={stats.total}
                reading={stats.reading}
                finished={stats.finished}
                notRead={stats.notRead}
                favorites={stats.favorites}
                onFavoritesClick={scrollToFavorites}
              />
            </div>
          </div>
        </div>

        {/* ---- Add Book Button - below stats, full width, purple ---- */}
        <div className="mb-8">
          <Button
            variant="default"
            className="w-full py-3 text-lg font-semibold rounded-xl bg-purple-700 hover:bg-purple-800 border-none text-white shadow transition-colors"
            onClick={() => setShowAddForm(true)}
            data-testid="add-book-button"
          >
            <Plus className="w-6 h-6 mr-2" /> Add Book
          </Button>
        </div>

        {/* ---- Favorites Section ---- */}
        <section
          ref={favoritesRef}
          className="pt-7 pb-10 mb-14 bg-white rounded-2xl shadow border border-slate-200"
          data-testid="favorites-section"
        >
          <div className="flex items-center gap-2 mb-4 px-8">
            <Star className="text-yellow-500" size={32} fill="#fde047" />
            <h2 className="text-3xl font-extrabold text-yellow-700 tracking-tight">Favorites</h2>
            <span className="ml-2 rounded bg-yellow-100 text-yellow-800 px-3 py-1 font-semibold text-xs">{stats.favorites}</span>
          </div>
          <div className="px-8 pb-3">
            {getFavoriteBooks().length === 0 ? (
              <div className="py-12 px-4 rounded-lg border border-yellow-100 bg-yellow-50 text-yellow-700 text-center font-medium shadow-none">
                <span>No favorite books yet! Click the <Star className="inline-block mb-1 text-yellow-400" size={18} fill="#fde047" /> icon to mark a book as favorite.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                {getFavoriteBooks().map(book => (
                  <div key={book._id} className="flex h-full min-h-[260px]">
                    {/* Remove ring/gradient, use clean card style */}
                    {renderBookCard({ ...book, _favoritesCard: true })}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
        {/* ---- End Favorites Section ---- */}

        <div className="space-y-12">
          <BooksSection
            title="Not Read"
            books={getBooksByStatus('not-read')}
            type="not-read"
            selectedIds={selectedNotReadIds}
            onToggleSelect={handleToggleSelect}
            onBulkMark={handleBulkMarkFinished}
            renderBookCard={renderBookCard}
            cardBgColor={sectionBg}
            cardBorderColor={borderColor}
          />

          <BooksSection
            title="Currently Reading"
            books={getBooksByStatus('reading')}
            type="reading"
            renderBookCard={renderBookCard}
            cardBgColor={sectionBg}
            cardBorderColor={borderColor}
          />

          <BooksSection
            title="Finished"
            books={getBooksByStatus('finished')}
            type="finished"
            renderBookCard={renderBookCard}
            cardBgColor={sectionBg}
            cardBorderColor={borderColor}
          />
        </div>
      </main>
    </div>
  );
};
