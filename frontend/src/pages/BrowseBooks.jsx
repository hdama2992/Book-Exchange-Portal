import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useAvailableBooks } from '../hooks/useBooks';
import { useCreateRequest } from '../hooks/useRequests';
import BookCard from '../components/BookCard';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { BookGridSkeleton } from '../components/Skeleton';
import { FadeIn, StaggerContainer, StaggerItem } from '../components/AnimatedLayout';
import { Search, Filter, Loader2, X, SlidersHorizontal } from 'lucide-react';

const genres = ['All', 'Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Sci-Fi', 'Fantasy', 'Biography', 'Self-Help'];
const conditions = ['All', 'Like New', 'Good', 'Fair', 'Acceptable'];

export default function BrowseBooks() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [toast, setToast] = useState(null);

  // TanStack Query hooks
  const { data: books = [], isLoading, error, refetch } = useAvailableBooks();
  const createRequest = useCreateRequest();

  // Filter books: remove user's own books and apply search + filters
  const filteredBooks = useMemo(() => {
    let filtered = books.filter(book => book.ownerId !== user?.id);

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(book =>
        book.bookTitle?.toLowerCase().includes(query) ||
        book.author?.toLowerCase().includes(query) ||
        book.genre?.toLowerCase().includes(query)
      );
    }

    // Genre filter
    if (selectedGenre !== 'All') {
      filtered = filtered.filter(book =>
        book.genre?.toLowerCase() === selectedGenre.toLowerCase()
      );
    }

    // Condition filter
    if (selectedCondition !== 'All') {
      filtered = filtered.filter(book =>
        book.bookCondition?.toLowerCase() === selectedCondition.toLowerCase()
      );
    }

    return filtered;
  }, [books, searchQuery, selectedGenre, selectedCondition, user?.id]);

  const hasActiveFilters = selectedGenre !== 'All' || selectedCondition !== 'All';

  const clearFilters = () => {
    setSelectedGenre('All');
    setSelectedCondition('All');
    setSearchQuery('');
  };

  const handleRequestBook = async () => {
    if (!selectedBook) return;

    try {
      await createRequest.mutateAsync({
        requesterId: user.id,
        ownerId: selectedBook.ownerId,
        bookId: selectedBook.bookId,
        message: requestMessage,
      });
      setToast({ message: 'Book request sent successfully!', type: 'success' });
      setSelectedBook(null);
      setRequestMessage('');
    } catch (error) {
      setToast({ message: error.response?.data?.message || 'Failed to send request', type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeIn>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Browse Books</h1>
          <p className="text-gray-500 mt-1">Discover and request books from the community</p>
        </div>
      </FadeIn>

      {/* Search & Filters */}
      <FadeIn delay={0.1}>
        <div className="glass-card-solid p-4 space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ios-input pl-12 pr-10"
                placeholder="Search by title, author, or genre..."
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className={`ios-button flex items-center gap-2 ${showFilters || hasActiveFilters ? 'bg-primary-100 text-primary-700' : ''}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-primary-500 rounded-full" />
              )}
            </motion.button>
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-4 border-t border-gray-200 space-y-4">
                  {/* Genre Filter */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Genre</label>
                    <div className="flex flex-wrap gap-2">
                      {genres.map(genre => (
                        <motion.button
                          key={genre}
                          onClick={() => setSelectedGenre(genre)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                            selectedGenre === genre
                              ? 'bg-primary-500 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {genre}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Condition Filter */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Condition</label>
                    <div className="flex flex-wrap gap-2">
                      {conditions.map(condition => (
                        <motion.button
                          key={condition}
                          onClick={() => setSelectedCondition(condition)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                            selectedCondition === condition
                              ? 'bg-primary-500 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {condition}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </FadeIn>

      {/* Results Count */}
      {!isLoading && !error && (
        <FadeIn delay={0.2}>
          <p className="text-sm text-gray-500">
            {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'} available
          </p>
        </FadeIn>
      )}

      {/* Results */}
      {isLoading ? (
        <BookGridSkeleton count={8} />
      ) : error ? (
        <FadeIn>
          <div className="text-center py-20">
            <motion.div
              className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <Search className="w-8 h-8 text-red-400" />
            </motion.div>
            <h3 className="text-lg font-medium text-gray-800 mb-1">Failed to load books</h3>
            <p className="text-gray-500 mb-4">{error.message}</p>
            <motion.button
              onClick={() => refetch()}
              className="ios-button-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try Again
            </motion.button>
          </div>
        </FadeIn>
      ) : filteredBooks.length === 0 ? (
        <FadeIn>
          <div className="text-center py-20">
            <motion.div
              className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <Search className="w-8 h-8 text-gray-400" />
            </motion.div>
            <h3 className="text-lg font-medium text-gray-800 mb-1">No books found</h3>
            <p className="text-gray-500 mb-2">Try a different search term or filter</p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        </FadeIn>
      ) : (
        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredBooks.map((book, index) => (
            <StaggerItem key={book.bookId}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <BookCard
                  book={book}
                  onAction={setSelectedBook}
                  actionLabel="Request Book"
                />
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
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
              <button
                onClick={handleRequestBook}
                disabled={createRequest.isPending}
                className="flex-1 ios-button-primary"
              >
                {createRequest.isPending ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Send Request'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}

