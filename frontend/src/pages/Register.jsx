import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { registerSchema } from '../lib/validations';
import { BookOpen, Mail, Lock, User, Phone, MapPin, ArrowRight, Loader2, Rocket, CheckCircle2 } from 'lucide-react';

// Google Icon Component
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const features = [
  'Access to thousands of books',
  'Connect with local readers',
  'AI-powered book recognition',
  'Track your reading history',
];

export default function Register() {
  const [serverError, setServerError] = useState('');
  const [oauthConfigured, setOauthConfigured] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if OAuth is configured
    fetch('http://localhost:8080/api/auth/oauth-providers')
      .then(res => res.json())
      .then(data => setOauthConfigured(data.google === true))
      .catch(() => setOauthConfigured(false));
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '', contactNo: '', address: '' },
  });

  const onSubmit = async (data) => {
    setServerError('');
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        contactNo: data.contactNo || undefined,
        address: data.address || undefined,
      });
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const handleOAuthLogin = (provider) => {
    window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
  };

  const inputClass = (hasError) =>
    `w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border ${hasError ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'} rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400`;

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Form */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-y-auto"
      >
        <div className="w-full max-w-md py-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">BookSwap</span>
            </Link>
          </div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center gap-2 mb-2">
              <Rocket className="w-5 h-5 text-emerald-500" />
              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Start your journey</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create your account</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Join our community of book lovers</p>
          </motion.div>

          {serverError && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
              {serverError}
            </motion.div>
          )}

          {/* Social Login - Always show Google option */}
          <div className="mb-4">
            <motion.button
              whileHover={{ scale: oauthConfigured ? 1.02 : 1 }}
              whileTap={{ scale: oauthConfigured ? 0.98 : 1 }}
              onClick={() => oauthConfigured ? handleOAuthLogin('google') : setServerError('Google Sign-In is not configured yet. Please register with email.')}
              className={`w-full flex items-center justify-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl font-medium transition-all shadow-sm ${oauthConfigured ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer' : 'text-gray-400 dark:text-gray-500 cursor-pointer'}`}
            >
              <GoogleIcon /> Continue with Google
              {!oauthConfigured && <span className="text-xs text-gray-400 ml-1">(coming soon)</span>}
            </motion.button>
          </div>

          {/* Divider */}
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-700"></div></div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-500">or register with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" {...register('name')} className={inputClass(errors.name)} placeholder="Full Name" />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" {...register('email')} className={inputClass(errors.email)} placeholder="Email Address" />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="password" {...register('password')} className={inputClass(errors.password)} placeholder="Password" />
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
              </div>
              <div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="password" {...register('confirmPassword')} className={inputClass(errors.confirmPassword)} placeholder="Confirm" />
                </div>
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="tel" {...register('contactNo')} className={inputClass(errors.contactNo)} placeholder="Phone (optional)" />
                </div>
              </div>
              <div>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" {...register('address')} className={inputClass(errors.address)} placeholder="City (optional)" />
                </div>
              </div>
            </div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50 mt-2">
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Create Account <ArrowRight className="w-5 h-5" /></>}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400">Sign in</Link>
          </p>
        </div>
      </motion.div>

      {/* Right Panel - Decorative */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600"
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <BookOpen className="w-10 h-10" />
              </div>
              <span className="text-3xl font-bold">BookSwap</span>
            </div>

            <h1 className="text-5xl font-bold leading-tight mb-6">
              Your Library,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-200">Reimagined</span>
            </h1>

            <p className="text-xl text-white/80 mb-8 max-w-md">
              Discover a smarter way to share and exchange books with readers in your community.
            </p>

            <div className="space-y-3">
              {features.map((feature, i) => (
                <motion.div key={i} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-3 text-white/90">
                  <CheckCircle2 className="w-5 h-5 text-yellow-300" />
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <div className="absolute bottom-0 right-0 w-80 h-80 opacity-20">
          <motion.div animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }} transition={{ duration: 4, repeat: Infinity }}
            className="absolute bottom-20 right-20 w-32 h-40 bg-white/30 rounded-lg transform rotate-12" />
          <motion.div animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}
            className="absolute bottom-32 right-40 w-28 h-36 bg-white/20 rounded-lg transform -rotate-6" />
        </div>
      </motion.div>
    </div>
  );
}

