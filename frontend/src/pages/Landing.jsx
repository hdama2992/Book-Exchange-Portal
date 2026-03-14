import { Link } from 'react-router-dom';
import { BookOpen, Users, ArrowLeftRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Suspense, lazy } from 'react';
import { FadeIn, StaggerContainer, StaggerItem, HoverScale } from '../components/AnimatedLayout';

// Lazy load 3D component for better performance
const FloatingBook = lazy(() => import('../components/FloatingBook'));

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 overflow-hidden">
      {/* 3D Background */}
      <Suspense fallback={null}>
        <FloatingBook />
      </Suspense>

      {/* Navigation */}
      <motion.nav
        className="absolute top-0 left-0 right-0 z-10"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <BookOpen className="w-8 h-8 text-white" />
            <span className="text-2xl font-bold text-white">BookSwap</span>
          </motion.div>
          <div className="flex items-center gap-4">
            <HoverScale>
              <Link to="/login" className="ios-button-ghost">
                Sign In
              </Link>
            </HoverScale>
            <HoverScale>
              <Link to="/register" className="ios-button bg-white/90 text-gray-800 hover:bg-white">
                Get Started
              </Link>
            </HoverScale>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn delay={0.2}>
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm"
              animate={{
                boxShadow: ['0 0 0 0 rgba(255,255,255,0.3)', '0 0 0 10px rgba(255,255,255,0)', '0 0 0 0 rgba(255,255,255,0)']
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-4 h-4" />
              Start exchanging books today
            </motion.div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              <motion.span
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Share Books,
              </motion.span>
              <br />
              <motion.span
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-gradient-to-r from-white via-pink-200 to-white bg-clip-text text-transparent"
              >
                Build Community
              </motion.span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.5}>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Join our community of book lovers. List your books, discover new reads,
              and connect with fellow readers for seamless book exchanges.
            </p>
          </FadeIn>

          <FadeIn delay={0.7}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <HoverScale scale={1.08}>
                <Link to="/register" className="ios-button-primary text-lg px-8 py-4 w-full sm:w-auto shadow-lg shadow-purple-500/30">
                  Start Exchanging
                </Link>
              </HoverScale>
              <HoverScale scale={1.08}>
                <Link to="/login" className="ios-button bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 text-lg px-8 py-4 w-full sm:w-auto">
                  Sign In
                </Link>
              </HoverScale>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <StaggerContainer className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <StaggerItem key={index}>
                  <HoverScale scale={1.05}>
                    <motion.div
                      className="glass-card p-8 text-center cursor-pointer"
                      whileHover={{
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        borderColor: 'rgba(255, 255, 255, 0.3)'
                      }}
                    >
                      <motion.div
                        className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-white/30 flex items-center justify-center"
                        whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </motion.div>
                      <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                      <p className="text-white/70">{feature.description}</p>
                    </motion.div>
                  </HoverScale>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 relative z-10">
        <FadeIn delay={0.3}>
          <div className="max-w-4xl mx-auto glass-card p-10 overflow-hidden">
            <div className="grid grid-cols-3 gap-8 text-center">
              {[
                { value: '500+', label: 'Books Shared' },
                { value: '200+', label: 'Active Users' },
                { value: '1K+', label: 'Exchanges' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <motion.div
                    className="text-4xl font-bold text-white mb-1"
                    whileHover={{ scale: 1.1 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-white/60">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Footer */}
      <motion.footer
        className="py-8 px-6 text-center text-white/60 relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <p>© 2024 BookSwap. Built with ❤️ for book lovers.</p>
      </motion.footer>
    </div>
  );
}

