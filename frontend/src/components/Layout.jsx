import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import {
  LayoutDashboard,
  BookOpen,
  Library,
  PlusCircle,
  ArrowLeftRight,
  User,
  LogOut,
  Menu,
  X
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/browse', label: 'Browse Books', icon: BookOpen },
  { path: '/my-books', label: 'My Books', icon: Library },
  { path: '/publish', label: 'Publish Book', icon: PlusCircle },
  { path: '/requests', label: 'Requests', icon: ArrowLeftRight },
];

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Mobile Header */}
      <header className="lg:hidden nav-glass dark:bg-gray-800/80 dark:border-gray-700/50 fixed top-0 left-0 right-0 z-50 px-4 py-3">
        <div className="flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2">
            <Menu className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          </button>
          <span className="text-lg font-semibold text-gray-800 dark:text-white">BookSwap</span>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/profile" className="p-2 -mr-2">
              <User className="w-6 h-6 text-gray-700 dark:text-gray-200" />
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-gray-800 shadow-xl animate-slide-up">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <span className="text-xl font-bold text-gray-800 dark:text-white">BookSwap</span>
                <button onClick={() => setSidebarOpen(false)}>
                  <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={isActive ? 'sidebar-link-active' : 'sidebar-link'}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50">
        <div className="flex-1 flex flex-col pt-8 pb-6 px-4">
          <div className="px-4 mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              BookSwap
            </h1>
            <ThemeToggle />
          </div>
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path} className={isActive ? 'sidebar-link-active' : 'sidebar-link'}>
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto space-y-1">
            <Link to="/profile" className={location.pathname === '/profile' ? 'sidebar-link-active' : 'sidebar-link'}>
              <User className="w-5 h-5" />
              {user?.name || 'Profile'}
            </Link>
            <button onClick={handleLogout} className="sidebar-link w-full text-red-600 hover:bg-red-50">
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64">
        <div className="pt-16 lg:pt-0 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

