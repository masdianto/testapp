import React, { useState, useMemo } from 'react';
import { News } from '../../types';
import PlusIcon from '../icons/PlusIcon';
import NewspaperIcon from '../icons/NewspaperIcon';
import EditIcon from '../icons/EditIcon';
import TrashIcon from '../icons/TrashIcon';

interface PimpinanNewsPageProps {
  news: News[];
  onSave: (newsItem: News) => void;
  onDelete: (id: string, title: string) => void;
  isLoading: boolean;
}

const PimpinanNewsPage: React.FC<PimpinanNewsPageProps> = ({ news, onSave, onDelete, isLoading }) => {
  const [newsToEdit, setNewsToEdit] = useState<News | null>(null);

  const sortedNews = useMemo(() => 
    [...news].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  [news]);

  const handleEditNews = (newsItem: News) => {
    onSave(newsItem);
  };
  
  const handleDeleteClick = (id: string, title: string) => {
      onDelete(id, title);
  }

  return (
      <div className="flex flex-col h-full">
        <header className="flex-shrink-0 flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <NewspaperIcon className="w-6 h-6" />
            Manajemen Berita
          </h1>
          <button
            onClick={() => onSave({} as News)} // Triggers modal in layout
            className="inline-flex items-center gap-1 px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Tambah</span>
          </button>
        </header>

        <main className="flex-grow overflow-y-auto p-4 space-y-3">
          {sortedNews.length > 0 ? (
            sortedNews.map((newsItem) => (
              <div key={newsItem.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 flex gap-4">
                <img src={newsItem.imageUrl} alt={newsItem.title} className="w-20 h-20 rounded-md object-cover flex-shrink-0" />
                <div className="flex-grow overflow-hidden">
                  <p className="text-sm font-semibold text-primary">{newsItem.category}</p>
                  <h2 className="font-bold text-gray-900 dark:text-white truncate">{newsItem.title}</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{new Date(newsItem.date).toLocaleString('id-ID')}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => handleEditNews(newsItem)} className="p-1.5 rounded-full text-gray-500 hover:bg-yellow-100 dark:hover:bg-yellow-500/20 hover:text-yellow-600 dark:hover:text-yellow-400">
                      <EditIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteClick(newsItem.id, newsItem.title)} className="p-1.5 rounded-full text-gray-500 hover:bg-red-100 dark:hover:bg-red-500/20 hover:text-red-600 dark:hover:text-red-400">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              <p>Belum ada berita.</p>
              <p className="text-sm">Klik tombol "Tambah" untuk membuat berita pertama.</p>
            </div>
          )}
        </main>
      </div>
  );
};

export default PimpinanNewsPage;
