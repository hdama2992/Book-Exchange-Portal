import { z } from 'zod';

// Auth validations
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be less than 50 characters'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(50, 'Password must be less than 50 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    contactNo: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^[+]?[\d\s-]{10,15}$/.test(val),
        'Please enter a valid phone number'
      ),
    address: z.string().max(200, 'Address must be less than 200 characters').optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Book validations
export const bookSchema = z.object({
  bookTitle: z
    .string()
    .min(1, 'Book title is required')
    .min(2, 'Title must be at least 2 characters')
    .max(200, 'Title must be less than 200 characters'),
  author: z
    .string()
    .min(1, 'Author name is required')
    .min(2, 'Author name must be at least 2 characters')
    .max(100, 'Author name must be less than 100 characters'),
  edition: z
    .number({ invalid_type_error: 'Edition must be a number' })
    .int('Edition must be a whole number')
    .min(1, 'Edition must be at least 1')
    .max(100, 'Edition must be less than 100')
    .optional()
    .or(z.literal('')),
  year: z
    .number({ invalid_type_error: 'Year must be a number' })
    .int('Year must be a whole number')
    .min(1000, 'Please enter a valid year')
    .max(new Date().getFullYear() + 1, 'Year cannot be in the future')
    .optional()
    .or(z.literal('')),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  isbn: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^(?:\d{10}|\d{13})$/.test(val.replace(/-/g, '')),
      'Please enter a valid ISBN (10 or 13 digits)'
    ),
  genre: z.string().min(1, 'Please select a genre'),
  bookCondition: z.string().min(1, 'Please select book condition'),
  photos: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});

// Request validation
export const requestSchema = z.object({
  bookId: z.number().int().positive('Book ID is required'),
  requesterId: z.number().int().positive('Requester ID is required'),
  message: z.string().max(500, 'Message must be less than 500 characters').optional(),
});

