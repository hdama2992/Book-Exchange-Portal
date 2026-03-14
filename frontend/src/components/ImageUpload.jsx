import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image as ImageIcon, Loader2, Sparkles } from 'lucide-react';
import api, { bookService } from '../services/api';

export default function ImageUpload({ onUpload, onRecognize, currentImage, className = '' }) {
  const [preview, setPreview] = useState(currentImage || null);
  const [uploading, setUploading] = useState(false);
  const [recognizing, setRecognizing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    // Upload file
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const fileUrl = response.data.fileUrl;
      onUpload(fileUrl);

      // Auto-recognize book if callback provided
      if (onRecognize && fileUrl) {
        setRecognizing(true);
        try {
          // Build full URL for OpenAI
          const fullUrl = fileUrl.startsWith('http') ? fileUrl : `${window.location.origin}${fileUrl}`;
          const bookInfo = await bookService.recognizeBook(fullUrl);
          if (bookInfo && Object.keys(bookInfo).length > 0) {
            onRecognize(bookInfo);
          }
        } catch (recognizeError) {
          console.log('AI recognition not available:', recognizeError);
        } finally {
          setRecognizing(false);
        }
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setPreview(null);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const clearImage = () => {
    setPreview(null);
    onUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />

      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative rounded-xl overflow-hidden aspect-[3/4] bg-gray-100"
          >
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            {(uploading || recognizing) && (
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2">
                {recognizing ? (
                  <>
                    <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
                    <span className="text-white text-sm font-medium">AI analyzing cover...</span>
                  </>
                ) : (
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                )}
              </div>
            )}
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`
              relative rounded-xl border-2 border-dashed aspect-[3/4] flex flex-col items-center 
              justify-center cursor-pointer transition-all duration-200
              ${dragActive 
                ? 'border-primary-500 bg-primary-50' 
                : 'border-gray-300 bg-gray-50 hover:border-primary-400 hover:bg-primary-50/50'
              }
            `}
          >
            <motion.div
              animate={{ y: dragActive ? -5 : 0 }}
              className="flex flex-col items-center gap-3"
            >
              {dragActive ? (
                <Upload className="w-10 h-10 text-primary-500" />
              ) : (
                <ImageIcon className="w-10 h-10 text-gray-400" />
              )}
              <div className="text-center px-4">
                <p className="text-sm font-medium text-gray-700">
                  {dragActive ? 'Drop image here' : 'Click or drag to upload'}
                </p>
                <p className="text-xs text-gray-500 mt-1">JPEG, PNG, GIF, WebP (max 10MB)</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

