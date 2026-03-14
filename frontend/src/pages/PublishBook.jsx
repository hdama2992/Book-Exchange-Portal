import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { bookService } from '../services/api';
import Toast from '../components/Toast';
import ImageUpload from '../components/ImageUpload';
import { BookOpen, User, Calendar, Hash, Loader2 } from 'lucide-react';

const genres = ['Fiction', 'Non-Fiction', 'Science', 'Technology', 'History', 'Biography', 'Fantasy', 'Mystery', 'Romance', 'Self-Help', 'Education', 'Other'];
const conditions = ['New', 'Like New', 'Good', 'Fair', 'Acceptable'];

export default function PublishBook() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [formData, setFormData] = useState({
    bookTitle: '', author: '', year: '', edition: 1, isbn: '', genre: '', bookCondition: 'Good', description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await bookService.publishBook({
        ...formData,
        photos: coverImage,
        year: parseInt(formData.year),
        edition: parseInt(formData.edition),
      }, user.id);
      setToast({ message: 'Book published successfully!', type: 'success' });
      setTimeout(() => navigate('/my-books'), 1500);
    } catch (error) {
      setToast({ message: error.response?.data?.message || 'Failed to publish book', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Publish a Book</h1>
        <p className="text-gray-500 mt-1">Share your book with the community</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card-solid p-8 space-y-6">
        {/* Cover Image & Basic Info */}
        <div className="grid sm:grid-cols-[200px,1fr] gap-6">
          {/* Book Cover Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Book Cover</label>
            <ImageUpload
              onUpload={setCoverImage}
              currentImage={coverImage}
            />
          </div>

          {/* Title, Author, Year, Edition */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Book Title *</label>
              <div className="relative">
                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" name="bookTitle" value={formData.bookTitle} onChange={handleChange}
                  className="ios-input pl-12" placeholder="Enter book title" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Author *</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" name="author" value={formData.author} onChange={handleChange}
                  className="ios-input pl-12" placeholder="Author name" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="number" name="year" value={formData.year} onChange={handleChange}
                    className="ios-input pl-12" placeholder="2024" min="1800" max="2030" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Edition</label>
                <input type="number" name="edition" value={formData.edition} onChange={handleChange}
                  className="ios-input" min="1" />
              </div>
            </div>
          </div>
        </div>

        {/* ISBN, Genre & Condition */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ISBN</label>
            <div className="relative">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" name="isbn" value={formData.isbn} onChange={handleChange}
                className="ios-input pl-12" placeholder="Optional" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
            <select name="genre" value={formData.genre} onChange={handleChange} className="ios-input">
              <option value="">Select genre</option>
              {genres.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
            <select name="bookCondition" value={formData.bookCondition} onChange={handleChange} className="ios-input">
              {conditions.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange}
            className="ios-input min-h-[120px] resize-none" placeholder="Brief description of the book..." />
        </div>

        {/* Submit */}
        <button type="submit" disabled={loading} className="w-full ios-button-primary flex items-center justify-center gap-2">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Publish Book'}
        </button>
      </form>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}

