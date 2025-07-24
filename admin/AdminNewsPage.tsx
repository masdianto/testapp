import React, { useState, useMemo } from 'react';
import { News } from '../../types';
import PlusIcon from '../icons/PlusIcon';
import NewspaperIcon from '../icons/NewspaperIcon';
import EditIcon from '../icons/EditIcon';
import TrashIcon from '../icons/TrashIcon';
import NewsModal from '../operator/NewsModal';

interface AdminNewsPageProps {
  news: News[];
  onSave: (newsItem: News) => void;
  onDelete: (id: string, title: string) => void;
  isLoading: boolean;
}

const AdminNewsPage: React.FC<AdminNewsPageProps> = ({ news, onSave, onDelete, isLoading }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newsToEdit, setNewsToEdit] = useState<News | null>(null);

  const sortedNews = useMemo(() => 
    [...news].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  [news]);

  const handleAddNews = () => {
    setNewsToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditNews = (newsItem: News) => {
    setNewsToEdit(newsItem);
    setIsModalOpen(true);
  };

  const handleSaveAndClose = async (newsItem: News) => {
    await onSave(newsItem);
    setIsModalOpen(false);
  };
  
  const handleDeleteClick = (id: string, title: string) => {
      onDelete(id, title);
  }

  return (
    <>
      <div className="animate-fade-in">
        <div className="flex justify-end mb-6">
          <button
            onClick={handleAddNews}
            className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Tambah Berita Baru</span>
          </button>
        </div>

        {sortedNews.length > 0 ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedNews.map((newsItem) => (
              <div key={newsItem.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col">
                <img src={newsItem.imageUrl} alt={newsItem.title} className="h-48 w-full object-cover" />
                <div className="p-4 flex flex-col flex-grow">
                    <p className="text-sm font-semibold text-primary">{newsItem.category}</p>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-1 flex-grow">{newsItem.title}</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{new Date(newsItem.date).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}</p>
                </div>
                 <div className="p-4 bg-gray-50 dark:bg-gray-700/50 flex justify-end gap-2">
                    <button onClick={() => handleEditNews(newsItem)} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-yellow-100 dark:hover:bg-yellow-500/20 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors" aria-label="Edit">
                      <EditIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDeleteClick(newsItem.id, newsItem.title)} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-500/20 hover:text-red-600 dark:hover:text-red-400 transition-colors" aria-label="Delete">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <NewspaperIcon className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-500" />
            <h3 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">Belum Ada Berita</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Klik tombol "Tambah Berita Baru" untuk membuat artikel pertama.</p>
          </div>
        )}
      </div>

      <NewsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAndClose}
        newsToEdit={newsToEdit}
        isLoading={isLoading}
      />
    </>
  );
};

export default AdminNewsPage;
