import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookService, requestService } from '../services/api';
import BookCard from '../components/BookCard';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { Search, Filter, Loader2 } from 'lucide-react';

export default function BrowseBooks() {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [requesting, setRequesting] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = books.filter(book =>
        book.bookTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.genre?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBooks(filtered);
    } else {
      setFilteredBooks(books);
    }
  }, [searchQuery, books]);

  const loadBooks = async () => {
    try {
      const data = await bookService.getAvailableBooks();
      // Filter out user's own books
      const otherBooks = data.filter(book => book.userId !== user?.id);
      setBooks(otherBooks);
      setFilteredBooks(otherBooks);
    } catch (error) {
      console.error('Error loading books:', error);
      setToast({ message: 'Failed to load books', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestBook = async () => {
    if (!selectedBook) return;
    setRequesting(true);

    try {
      await requestService.createRequest({
        requesterId: user.id,
        ownerId: selectedBook.userId,
        bookId: selectedBook.bookId,
        message: requestMessage,
      });
      setToast({ message: 'Book request sent successfully!', type: 'success' });
      setSelectedBook(null);
      setRequestMessage('');
      loadBooks(); // Refresh to update status
    } catch (error) {
      setToast({ message: error.response?.data?.message || 'Failed to send request', type: 'error' });
    } finally {
      setRequesting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Browse Books</h1>
        <p className="text-gray-500 mt-1">Discover and request books from the community</p>
      </div>

      {/* Search */}
      <div className="glass-card-solid p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ios-input pl-12"
            placeholder="Search by title, author, or genre..."
          />
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-1">No books found</h3>
          <p className="text-gray-500">Try a different search term</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredBooks.map(book => (
            <BookCard
              key={book.bookId}
              book={book}
              onAction={setSelectedBook}
              actionLabel="Request Book"
            />
          ))}
        </div>
      )}

      {/* Request Modal */}
      <Modal isOpen={!!selectedBook} onClose={() => setSelectedBook(null)} title="Request Book">
        {selectedBook && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-gray-800">{selectedBook.bookTitle}</h3>
              <p className="text-sm text-gray-500">by {selectedBook.author}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message to owner (optional)
              </label>
              <textarea
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                className="ios-input min-h-[100px] resize-none"
                placeholder="Why would you like to borrow this book?"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setSelectedBook(null)} className="flex-1 ios-button-secondary">
                Cancel
              </button>
              <button onClick={handleRequestBook} disabled={requesting} className="flex-1 ios-button-primary">
                {requesting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Send Request'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}

