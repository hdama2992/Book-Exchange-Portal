import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookService, requestService } from '../services/api';
import BookCard from '../components/BookCard';
import { BookOpen, ArrowLeftRight, TrendingUp, Clock, ChevronRight } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalBooks: 0, pendingRequests: 0, activeExchanges: 0 });
  const [recentBooks, setRecentBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const [books, myRequests, incomingRequests] = await Promise.all([
        bookService.getAvailableBooks(),
        requestService.getMyRequests(user?.id),
        requestService.getIncomingRequests(user?.id),
      ]);

      setRecentBooks(books.slice(0, 4));
      
      const pending = incomingRequests.filter(r => r.status === 'PENDING').length;
      const active = myRequests.filter(r => ['APPROVED', 'BORROWED'].includes(r.status)).length;
      
      setStats({
        totalBooks: books.length,
        pendingRequests: pending,
        activeExchanges: active,
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Available Books', value: stats.totalBooks, icon: BookOpen, color: 'from-blue-500 to-cyan-500' },
    { label: 'Pending Requests', value: stats.pendingRequests, icon: Clock, color: 'from-amber-500 to-orange-500' },
    { label: 'Active Exchanges', value: stats.activeExchanges, icon: ArrowLeftRight, color: 'from-emerald-500 to-teal-500' },
  ];

  return (
    <div className="space-y-8 animate-in">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, {user?.name?.split(' ')[0] || 'Reader'}! 👋
        </h1>
        <p className="text-gray-500 mt-1">Here's what's happening in your book community</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="glass-card-solid p-6">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-800">{stat.value}</div>
              <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="glass-card-solid p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          <Link to="/publish" className="flex items-center gap-3 p-4 rounded-xl bg-primary-50 hover:bg-primary-100 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-medium text-gray-800">Publish Book</div>
              <div className="text-xs text-gray-500">Share with community</div>
            </div>
          </Link>
          <Link to="/browse" className="flex items-center gap-3 p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-medium text-gray-800">Browse Books</div>
              <div className="text-xs text-gray-500">Discover new reads</div>
            </div>
          </Link>
          <Link to="/requests" className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 hover:bg-amber-100 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center">
              <ArrowLeftRight className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-medium text-gray-800">View Requests</div>
              <div className="text-xs text-gray-500">{stats.pendingRequests} pending</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Books */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Recently Added Books</h2>
          <Link to="/browse" className="text-primary-600 font-medium text-sm flex items-center gap-1 hover:text-primary-700">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="glass-card-solid p-5 animate-pulse">
                <div className="aspect-[3/4] bg-gray-200 rounded-xl mb-4" />
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentBooks.map(book => (
              <BookCard key={book.bookId} book={book} showOwner={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

