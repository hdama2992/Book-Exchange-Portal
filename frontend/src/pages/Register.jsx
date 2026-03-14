import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../context/AuthContext';
import { registerSchema } from '../lib/validations';
import { BookOpen, Mail, Lock, User, Phone, MapPin, ArrowRight, Loader2 } from 'lucide-react';

export default function Register() {
  const [serverError, setServerError] = useState('');
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      contactNo: '',
      address: '',
    },
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <BookOpen className="w-10 h-10 text-white" />
            <span className="text-3xl font-bold text-white">BookSwap</span>
          </Link>
        </div>

        {/* Register Card */}
        <div className="glass-card-solid p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Create account</h1>
          <p className="text-gray-500 mb-6">Join our community of book lovers</p>

          {serverError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" {...register('name')}
                  className={`ios-input pl-12 ${errors.name ? 'border-red-400' : ''}`} placeholder="Full Name" />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" {...register('email')}
                  className={`ios-input pl-12 ${errors.email ? 'border-red-400' : ''}`} placeholder="Email Address" />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="password" {...register('password')}
                    className={`ios-input pl-12 ${errors.password ? 'border-red-400' : ''}`} placeholder="Password" />
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
              </div>
              <div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="password" {...register('confirmPassword')}
                    className={`ios-input pl-12 ${errors.confirmPassword ? 'border-red-400' : ''}`} placeholder="Confirm" />
                </div>
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <div>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="tel" {...register('contactNo')}
                  className={`ios-input pl-12 ${errors.contactNo ? 'border-red-400' : ''}`} placeholder="Phone Number (optional)" />
              </div>
              {errors.contactNo && <p className="mt-1 text-sm text-red-500">{errors.contactNo.message}</p>}
            </div>

            <div>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" {...register('address')}
                  className={`ios-input pl-12 ${errors.address ? 'border-red-400' : ''}`} placeholder="Address (optional)" />
              </div>
              {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting}
              className="w-full ios-button-primary flex items-center justify-center gap-2 mt-6">
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>Create Account<ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

