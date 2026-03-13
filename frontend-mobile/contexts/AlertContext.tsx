import React, { createContext, useContext, useState } from 'react';
import { CustomAlert } from '@/components/CustomAlert';

export type AlertButton = {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
};

export type AlertConfig = {
  title: string;
  message?: string;
  buttons?: AlertButton[];
  input?: {
    placeholder?: string;
    secureTextEntry?: boolean;
    onSubmit: (value: string) => void;
  };
};

type AlertContextType = {
  showAlert: (config: AlertConfig) => void;
};

const AlertContext = createContext<AlertContextType | null>(null);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [config, setConfig] = useState<AlertConfig | null>(null);

  function showAlert(alertConfig: AlertConfig) {
    setConfig(alertConfig);
    setVisible(true);
  }

  function handleDismiss() {
    setVisible(false);
  }

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {config && (
        <CustomAlert
          visible={visible}
          config={config}
          onDismiss={handleDismiss}
        />
      )}
    </AlertContext.Provider>
  );
}

export function useAlert(): AlertContextType {
  const ctx = useContext(AlertContext);
  if (!ctx) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return ctx;
}
