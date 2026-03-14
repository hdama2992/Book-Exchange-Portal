import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookService } from '../services/api';
import BookCard from '../components/BookCard';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { Plus, Loader2, BookOpen, Trash2 } from 'lucide-react';

export default function MyBooks() {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadMyBooks();
  }, [user]);

  const loadMyBooks = async () => {
    try {
      const data = await bookService.getUserBooks(user?.id);
      setBooks(data);
    } catch (error) {
      console.error('Error loading books:', error);
      setToast({ message: 'Failed to load your books', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    setDeleting(true);

    try {
      await bookService.deleteBook(deleteModal.bookId);
      setToast({ message: 'Book deleted successfully', type: 'success' });
      setDeleteModal(null);
      loadMyBooks();
    } catch (error) {
      setToast({ message: 'Failed to delete book', type: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Books</h1>
          <p className="text-gray-500 mt-1">Books you've published for exchange</p>
        </div>
        <Link to="/publish" className="ios-button-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Publish Book
        </Link>
      </div>

      {/* Books Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-20 glass-card-solid">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary-50 flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-primary-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No books yet</h3>
          <p className="text-gray-500 mb-6">Start by publishing your first book</p>
          <Link to="/publish" className="ios-button-primary inline-flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Publish Your First Book
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {books.map(book => (
            <div key={book.bookId} className="relative group">
              <BookCard book={book} showOwner={false} />
              <button
                onClick={() => setDeleteModal(book)}
                className="absolute top-3 right-3 p-2 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="Delete Book">
        {deleteModal && (
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to delete <strong>"{deleteModal.bookTitle}"</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setDeleteModal(null)} className="flex-1 ios-button-secondary">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleting}
                className="flex-1 ios-button bg-red-500 text-white hover:bg-red-600">
                {deleting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Delete'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}

