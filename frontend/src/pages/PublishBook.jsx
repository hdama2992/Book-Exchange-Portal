import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api, { bookService } from '../services/api';
import Toast from '../components/Toast';
import { Camera, Upload, Sparkles, Loader2, Check, BookOpen, X, ArrowRight } from 'lucide-react';

const genres = ['Fiction', 'Non-Fiction', 'Science', 'Technology', 'History', 'Biography', 'Fantasy', 'Mystery', 'Romance', 'Self-Help', 'Education', 'Other'];
const conditions = ['New', 'Like New', 'Good', 'Fair', 'Acceptable'];

export default function PublishBook() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // States
  const [step, setStep] = useState('upload'); // 'upload' | 'processing' | 'confirm'
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [preview, setPreview] = useState(null);
  const [coverImageUrl, setCoverImageUrl] = useState(null);
  const [bookCondition, setBookCondition] = useState('Good');
  const [bookData, setBookData] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;

    // Validate file
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setToast({ message: 'Please upload a valid image (JPEG, PNG, GIF, WebP)', type: 'error' });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setToast({ message: 'Image must be less than 10MB', type: 'error' });
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    setStep('processing');

    try {
      // Upload image
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const fileUrl = uploadRes.data.fileUrl;
      setCoverImageUrl(fileUrl);

      // AI Recognition
      const fullUrl = fileUrl.startsWith('http') ? fileUrl : `${window.location.origin}${fileUrl}`;
      const bookInfo = await bookService.recognizeBook(fullUrl);

      setBookData({
        bookTitle: bookInfo.title || 'Unknown Title',
        author: bookInfo.author || 'Unknown Author',
        year: bookInfo.year || new Date().getFullYear().toString(),
        isbn: bookInfo.isbn || '',
        genre: genres.includes(bookInfo.genre) ? bookInfo.genre : 'Other',
        description: bookInfo.description || '',
        edition: 1,
      });

      setStep('confirm');
      setToast({ message: '✨ Book details detected!', type: 'success' });
    } catch (error) {
      console.error('Error:', error);
      // Still allow manual entry if AI fails
      setBookData({
        bookTitle: '', author: '', year: new Date().getFullYear().toString(),
        isbn: '', genre: '', description: '', edition: 1,
      });
      setStep('confirm');
      setToast({ message: 'AI detection unavailable. Please fill in details manually.', type: 'info' });
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handlePublish = async () => {
    if (!bookData?.bookTitle || !bookData?.author) {
      setToast({ message: 'Title and Author are required', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      await bookService.publishBook({
        ...bookData,
        bookCondition,
        photos: coverImageUrl,
        year: parseInt(bookData.year) || new Date().getFullYear(),
        edition: parseInt(bookData.edition) || 1,
      }, user.id);
      setToast({ message: '🎉 Book published successfully!', type: 'success' });
      setTimeout(() => navigate('/my-books'), 1500);
    } catch (error) {
      setToast({ message: error.response?.data?.message || 'Failed to publish', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const resetUpload = () => {
    setStep('upload');
    setPreview(null);
    setCoverImageUrl(null);
    setBookData(null);
  };

  return (
    <div className="max-w-xl mx-auto animate-in px-4 py-8">
      {/* Header */}
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400 text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          AI-Powered Publishing
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Publish a Book</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Just snap a photo — AI does the rest!</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* STEP 1: Upload */}
        {step === 'upload' && (
          <motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} className="hidden" />

            <div
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
              className={`relative rounded-3xl border-2 border-dashed p-12 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 min-h-[400px] ${dragActive ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 scale-[1.02]' : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 hover:border-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-900/10'}`}
            >
              <motion.div animate={{ scale: dragActive ? 1.1 : 1 }} className="mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-xl shadow-purple-500/30">
                  <Camera className="w-12 h-12 text-white" />
                </div>
              </motion.div>

              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                {dragActive ? 'Drop your photo!' : 'Upload Book Cover'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-center max-w-xs">
                Take a photo or drag & drop. Our AI will instantly detect the book details.
              </p>

              <div className="flex gap-3 mt-8">
                <button type="button" className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-purple-500/25">
                  <Upload className="w-5 h-5" />
                  Choose Photo
                </button>
              </div>

              <p className="text-xs text-gray-400 mt-4">JPEG, PNG, GIF, WebP (max 10MB)</p>
            </div>
          </motion.div>
        )}

        {/* STEP 2: Processing */}
        {step === 'processing' && (
          <motion.div key="processing" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="rounded-3xl bg-gradient-to-br from-purple-600 to-pink-600 p-8 text-white text-center min-h-[400px] flex flex-col items-center justify-center">
            {preview && <img src={preview} alt="Uploading" className="w-40 h-56 object-cover rounded-xl mb-6 shadow-2xl" />}
            <Sparkles className="w-12 h-12 mb-4 animate-pulse" />
            <h3 className="text-2xl font-bold mb-2">AI is analyzing...</h3>
            <p className="text-white/80">Detecting title, author, and more</p>
            <Loader2 className="w-8 h-8 mt-6 animate-spin" />
          </motion.div>
        )}

        {/* STEP 3: Confirm */}
        {step === 'confirm' && bookData && (
          <motion.div key="confirm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="rounded-3xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden shadow-xl">

            {/* Preview Header */}
            <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-6 flex items-center gap-4">
              <button onClick={resetUpload} className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                <X className="w-5 h-5 text-white" />
              </button>
              {preview && <img src={preview} alt="Book" className="w-20 h-28 object-cover rounded-lg shadow-lg" />}
              <div className="text-white">
                <div className="flex items-center gap-2 mb-1">
                  <Check className="w-5 h-5 text-green-300" />
                  <span className="text-sm font-medium text-green-200">AI Detected</span>
                </div>
                <h3 className="text-xl font-bold">{bookData.bookTitle || 'Book Title'}</h3>
                <p className="text-white/80">by {bookData.author || 'Author'}</p>
              </div>
            </div>

            {/* Editable Fields */}
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Review and edit if needed:</p>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Title *</label>
                  <input type="text" value={bookData.bookTitle} onChange={(e) => setBookData({ ...bookData, bookTitle: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Author *</label>
                  <input type="text" value={bookData.author} onChange={(e) => setBookData({ ...bookData, author: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Year</label>
                  <input type="text" value={bookData.year} onChange={(e) => setBookData({ ...bookData, year: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Condition</label>
                  <select value={bookCondition} onChange={(e) => setBookCondition(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    {conditions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handlePublish} disabled={loading}
                className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 transition-all disabled:opacity-50">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><BookOpen className="w-5 h-5" /> Publish Book <ArrowRight className="w-5 h-5" /></>}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}

