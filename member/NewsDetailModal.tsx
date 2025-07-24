import React from 'react';
import { News } from '../../types';
import XIcon from '../icons/XIcon';

interface NewsDetailModalProps {
  news: News;
  onClose: () => void;
}

const NewsDetailModal: React.FC<NewsDetailModalProps> = ({ news, onClose }) => {
  return (
    <div
      className="absolute inset-0 bg-gray-100 dark:bg-gray-900 z-40 flex flex-col animate-slide-up"
      aria-modal="true"
      role="dialog"
    >
      <header className="flex-shrink-0">
        <div className="relative h-48 bg-gray-300 dark:bg-gray-700">
            {news.imageUrl && (
                <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 bg-black/40 text-white rounded-full hover:bg-black/60 transition-colors"
                aria-label="Tutup detail berita"
            >
                <XIcon className="w-5 h-5" />
            </button>
             <div className="absolute bottom-0 left-0 p-4 text-white">
                <h2 className="text-2xl font-bold leading-tight shadow-text">{news.title}</h2>
             </div>
        </div>
      </header>
      <main className="flex-grow p-6 overflow-y-auto">
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
          <span className="font-semibold text-primary">{news.category}</span>
          <span>&bull;</span>
          <span>{new Date(news.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
        <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
          <p>{news.content}</p>
        </div>
      </main>
      <footer className="p-4 flex-shrink-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onClose}
          className="w-full px-6 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          Tutup
        </button>
      </footer>
    </div>
  );
};

export default NewsDetailModal;