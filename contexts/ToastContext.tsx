import React, { createContext, useState, useContext, useCallback, ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Toast from '../components/Toast';

type ToastType = 'success' | 'error';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const ToastContainer: React.FC<{ toasts: ToastMessage[]; removeToast: (id: string) => void }> = ({ toasts, removeToast }) => {
    const [container, setContainer] = useState<HTMLElement | null>(null);

    useEffect(() => {
        let portalRoot = document.getElementById('toast-portal-root');
        if (!portalRoot) {
            portalRoot = document.createElement('div');
            portalRoot.id = 'toast-portal-root';
            portalRoot.className = 'fixed top-5 right-5 z-[100] space-y-3';
            document.body.appendChild(portalRoot);
        }
        setContainer(portalRoot);
    }, []);

    if (container) {
        return createPortal(
             <>
                {toasts.map((toast) => (
                    <Toast key={toast.id} toast={toast} onRemove={removeToast} />
                ))}
            </>,
            container
        );
    }
    
    return null;
};


export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: ToastType, duration?: number) => {
    const id = crypto.randomUUID();
    setToasts((prevToasts) => [...prevToasts, { id, message, type, duration }]);
  }, []);
  
  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback((message: string, duration?: number) => {
    addToast(message, 'success', duration);
  }, [addToast]);
  
  const error = useCallback((message: string, duration?: number) => {
    addToast(message, 'error', duration);
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ success, error }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};
