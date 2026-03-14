import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-14 h-7 rounded-full p-1 transition-colors duration-300
                 bg-gray-200 dark:bg-gray-700
                 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                 dark:focus:ring-offset-gray-900"
      whileTap={{ scale: 0.95 }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* Track background icons */}
      <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-yellow-500 text-xs">
        ☀️
      </span>
      <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-blue-300 text-xs">
        🌙
      </span>

      {/* Sliding knob */}
      <motion.span
        className="block w-5 h-5 rounded-full bg-white shadow-md"
        initial={false}
        animate={{
          x: isDark ? 26 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
      />
    </motion.button>
  );
}

