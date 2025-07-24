import React from 'react';
import XIcon from './icons/XIcon';
import ExclamationTriangleIcon from './icons/ExclamationTriangleIcon';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, title, description, onConfirm, onCancel }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex justify-center items-center p-4"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-sm flex flex-col animate-fade-in-down"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 flex items-start gap-4">
            <div className="flex-shrink-0 mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/50 sm:mx-0 sm:h-10 sm:w-10">
                <ExclamationTriangleIcon className="h-6 w-6 text-danger" aria-hidden="true" />
            </div>
            <div className="flex-1 text-left">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white" id="confirm-modal-title">
                    {title}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {description}
                </p>
            </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 rounded-b-lg">
          <button
            type="button"
            className="w-full justify-center rounded-md bg-white dark:bg-gray-600 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500 sm:w-auto"
            onClick={onCancel}
          >
            Batal
          </button>
          <button
            type="button"
            className="w-full justify-center rounded-md bg-danger px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 sm:w-auto"
            onClick={onConfirm}
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
