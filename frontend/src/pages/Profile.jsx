import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookService } from '../services/api';
import Toast from '../components/Toast';
import { User, Mail, Phone, MapPin, BookOpen, Calendar, Shield } from 'lucide-react';
import { format } from 'date-fns';

export default function Profile() {
  const { user, logout } = useAuth();
  const [booksCount, setBooksCount] = useState(0);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadUserStats();
  }, [user]);

  const loadUserStats = async () => {
    try {
      const books = await bookService.getUserBooks(user?.id);
      setBooksCount(books.length);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
        <p className="text-gray-500 mt-1">Your account information</p>
      </div>

      {/* Profile Card */}
      <div className="glass-card-solid p-8">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                user?.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-primary-100 text-primary-700'
              }`}>
                <Shield className="w-3 h-3" />
                {user?.role || 'USER'}
              </span>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <Mail className="w-5 h-5 text-gray-400" />
            <div>
              <div className="text-xs text-gray-500">Email</div>
              <div className="font-medium text-gray-800">{user?.email}</div>
            </div>
          </div>

          {user?.contactNo && (
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-xs text-gray-500">Phone</div>
                <div className="font-medium text-gray-800">{user.contactNo}</div>
              </div>
            </div>
          )}

          {user?.address && (
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-xs text-gray-500">Address</div>
                <div className="font-medium text-gray-800">{user.address}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Card */}
      <div className="glass-card-solid p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-primary-50 rounded-xl text-center">
            <BookOpen className="w-6 h-6 text-primary-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{booksCount}</div>
            <div className="text-sm text-gray-500">Books Published</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-xl text-center">
            <Calendar className="w-6 h-6 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">
              {user?.createdAt ? format(new Date(user.createdAt), 'MMM yyyy') : 'N/A'}
            </div>
            <div className="text-sm text-gray-500">Member Since</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="glass-card-solid p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Actions</h3>
        <button
          onClick={handleLogout}
          className="w-full ios-button bg-red-50 text-red-600 hover:bg-red-100"
        >
          Sign Out
        </button>
      </div>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}

