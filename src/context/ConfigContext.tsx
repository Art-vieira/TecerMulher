import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAppConfig, updateAppConfig, AppConfig } from '../services/DatabaseRepository';
import { db } from '../firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';

interface ConfigContextType {
  config: AppConfig;
  updateFontSize: (factor: number) => Promise<void>;
  loadingConfig: boolean;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<AppConfig>({ fontSizeFactor: 1.0 });
  const [loadingConfig, setLoadingConfig] = useState(true);

  useEffect(() => {
    // Listener em tempo real para configurações globais
    const unsub = onSnapshot(doc(db, 'app_config', 'settings'), (doc) => {
      if (doc.exists()) {
        setConfig(doc.data() as AppConfig);
      }
      setLoadingConfig(false);
    });

    return () => unsub();
  }, []);

  const updateFontSize = async (factor: number) => {
    await updateAppConfig({ fontSizeFactor: factor });
  };

  return (
    <ConfigContext.Provider value={{ config, updateFontSize, loadingConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}
