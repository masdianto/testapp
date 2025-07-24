import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';
import ConfirmModal from '../components/ConfirmModal';

interface ConfirmContextType {
  show: (title: string, description?: string) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
};

interface ConfirmOptions {
    title: string;
    description: string;
}

export const ConfirmProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolver, setResolver] = useState<{ resolve: (value: boolean) => void } | null>(null);

  const show = useCallback((title: string, description: string = '') => {
    return new Promise<boolean>((resolve) => {
      setOptions({ title, description });
      setResolver({ resolve });
    });
  }, []);

  const handleConfirm = () => {
    resolver?.resolve(true);
    setOptions(null);
  };

  const handleCancel = () => {
    resolver?.resolve(false);
    setOptions(null);
  };

  return (
    <ConfirmContext.Provider value={{ show }}>
      {children}
      <ConfirmModal
        isOpen={options !== null}
        title={options?.title || ''}
        description={options?.description || ''}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ConfirmContext.Provider>
  );
};
