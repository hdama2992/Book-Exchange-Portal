import { BookOpen, User, Calendar } from 'lucide-react';

const statusColors = {
  AVAILABLE: 'status-available',
  BORROWED: 'status-borrowed',
  RESERVED: 'bg-purple-100 text-purple-700',
  UNAVAILABLE: 'bg-gray-100 text-gray-700',
};

const statusLabels = {
  AVAILABLE: 'Available',
  BORROWED: 'Borrowed',
  RESERVED: 'Reserved',
  UNAVAILABLE: 'Unavailable',
};

export default function BookCard({ book, onAction, actionLabel, showOwner = true }) {
  return (
    <div className="book-card group">
      {/* Book Cover */}
      <div className="aspect-[3/4] bg-gradient-to-br from-primary-100 to-purple-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
        {book.photos ? (
          <img src={book.photos} alt={book.bookTitle} className="w-full h-full object-cover" />
        ) : (
          <BookOpen className="w-16 h-16 text-primary-400" />
        )}
      </div>

      {/* Book Info */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-800 line-clamp-2 leading-tight">
            {book.bookTitle}
          </h3>
          <span className={`${statusColors[book.status]} shrink-0`}>
            {statusLabels[book.status]}
          </span>
        </div>

        <p className="text-sm text-gray-500 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5" />
          {book.author}
        </p>

        {book.year && (
          <p className="text-sm text-gray-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {book.year}
          </p>
        )}

        {book.genre && (
          <span className="inline-block text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
            {book.genre}
          </span>
        )}

        {showOwner && book.ownerName && (
          <p className="text-xs text-gray-400 pt-1 border-t border-gray-100">
            Owned by {book.ownerName}
          </p>
        )}

        {onAction && book.status === 'AVAILABLE' && (
          <button
            onClick={() => onAction(book)}
            className="w-full mt-3 ios-button-primary text-sm py-2.5"
          >
            {actionLabel || 'Request Book'}
          </button>
        )}
      </div>
    </div>
  );
}

