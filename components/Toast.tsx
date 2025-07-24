import React, { useEffect, useState } from 'react';
import CheckCircleIcon from './icons/CheckCircleIcon';
import ExclamationCircleIcon from './icons/ExclamationCircleIcon';
import XIcon from './icons/XIcon';
import { ToastMessage } from '../contexts/ToastContext';

interface ToastProps {
  toast: ToastMessage;
  onRemove: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onRemove }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingOut(true);
    }, toast.duration || 4000);

    const removeTimer = setTimeout(() => {
        onRemove(toast.id);
    }, (toast.duration || 4000) + 300);

    return () => {
        clearTimeout(timer);
        clearTimeout(removeTimer);
    };
  }, [toast, onRemove]);

  const handleRemove = () => {
    setIsFadingOut(true);
    setTimeout(() => onRemove(toast.id), 300);
  };
  
  const baseClasses = "flex items-start w-full max-w-sm p-4 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5";
  const typeClasses = {
    success: 'bg-green-50 dark:bg-green-900/50 text-green-700 dark:text-green-200',
    error: 'bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-200',
  };
  
  const Icon = toast.type === 'success' ? 
    <CheckCircleIcon className="w-6 h-6 text-green-500" /> : 
    <ExclamationCircleIcon className="w-6 h-6 text-red-500" />;

  return (
    <div 
        className={`${baseClasses} ${typeClasses[toast.type]} ${isFadingOut ? 'animate-toast-out' : 'animate-toast-in'}`}
        role="alert"
        aria-live="assertive"
    >
        <div className="flex-shrink-0">
            {Icon}
        </div>
        <div className="ml-3 flex-1">
            <p className="text-sm font-semibold">{toast.message}</p>
        </div>
        <button onClick={handleRemove} className="ml-4 p-1 rounded-full text-current opacity-70 hover:opacity-100 hover:bg-black/10">
            <XIcon className="w-4 h-4" />
        </button>
    </div>
  );
};

export default Toast;
