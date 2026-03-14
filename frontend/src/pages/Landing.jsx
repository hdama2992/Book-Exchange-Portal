import { Link } from 'react-router-dom';
import { BookOpen, Users, ArrowLeftRight, Sparkles } from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: 'Share Your Books',
    description: 'List your books and share them with readers in your community.',
  },
  {
    icon: Users,
    title: 'Connect with Readers',
    description: 'Find fellow book lovers and expand your reading network.',
  },
  {
    icon: ArrowLeftRight,
    title: 'Easy Exchange',
    description: 'Simple request and approval system for seamless book exchanges.',
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-white" />
            <span className="text-2xl font-bold text-white">BookSwap</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="ios-button-ghost">
              Sign In
            </Link>
            <Link to="/register" className="ios-button bg-white/90 text-gray-800 hover:bg-white">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm">
            <Sparkles className="w-4 h-4" />
            Start exchanging books today
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Share Books,<br />Build Community
          </h1>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Join our community of book lovers. List your books, discover new reads, 
            and connect with fellow readers for seamless book exchanges.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="ios-button-primary text-lg px-8 py-4 w-full sm:w-auto">
              Start Exchanging
            </Link>
            <Link to="/login" className="ios-button bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 text-lg px-8 py-4 w-full sm:w-auto">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="glass-card p-8 text-center hover:-translate-y-1 transition-transform duration-300"
                >
                  <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-white/30 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-white/70">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto glass-card p-10">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-1">500+</div>
              <div className="text-white/60">Books Shared</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-1">200+</div>
              <div className="text-white/60">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-1">1K+</div>
              <div className="text-white/60">Exchanges</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-white/60">
        <p>© 2024 BookSwap. Built with ❤️ for book lovers.</p>
      </footer>
    </div>
  );
}

