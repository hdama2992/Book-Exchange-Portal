import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function OAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const userId = searchParams.get('userId');
    const name = searchParams.get('name');
    const email = searchParams.get('email');
    const error = searchParams.get('error');

    if (error) {
      navigate('/login?error=' + encodeURIComponent(error));
      return;
    }

    if (token && userId && name && email) {
      // Store auth data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({
        id: parseInt(userId),
        name: decodeURIComponent(name),
        email: decodeURIComponent(email),
      }));

      // Update auth context
      login({
        token,
        user: {
          id: parseInt(userId),
          name: decodeURIComponent(name),
          email: decodeURIComponent(email),
        }
      });

      // Redirect to dashboard
      navigate('/dashboard');
    } else {
      navigate('/login?error=OAuth+authentication+failed');
    }
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
          Completing sign in...
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Please wait while we set up your account
        </p>
      </div>
    </div>
  );
}

