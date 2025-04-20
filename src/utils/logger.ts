/**
 * Logger utility untuk standardisasi logging pada aplikasi
 * Menyediakan level logging berbeda dan format yang konsisten
 */

// Tingkat log - dari rendah ke tinggi (semakin tinggi, semakin penting)
enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

// Struktur data untuk log
interface LogEntry {
  level: LogLevel;
  component: string;
  message: string;
  timestamp: Date;
  data?: Record<string, unknown> | string | number | boolean | null;
}

// Konfigurasi logger
const config = {
  // Set ke level lebih tinggi untuk mengurangi log (misalnya: LogLevel.INFO untuk menghilangkan DEBUG logs)
  level: LogLevel.DEBUG,
  // Set ke true untuk juga menyimpan log ke localStorage
  persistToStorage: true,
  // Prefix for localStorage
  storagePrefix: 'quicktodo_log_',
  // Max logs to keep in storage
  maxLogsInStorage: 100,
};

// Warna untuk setiap level log
const colors = {
  [LogLevel.DEBUG]: 'color: #6c757d',
  [LogLevel.INFO]: 'color: #0d6efd',
  [LogLevel.WARN]: 'color: #fd7e14',
  [LogLevel.ERROR]: 'color: #dc3545; font-weight: bold',
};

// Labels untuk setiap level log
const labels = {
  [LogLevel.DEBUG]: 'DEBUG',
  [LogLevel.INFO]: 'INFO',
  [LogLevel.WARN]: 'WARN',
  [LogLevel.ERROR]: 'ERROR',
};

// Array untuk menyimpan log dalam memory
const inMemoryLogs: LogEntry[] = [];

// Function untuk menyimpan log ke localStorage
const persistLog = (
  level: LogLevel, 
  component: string, 
  message: string, 
  data?: Record<string, unknown> | string | number | boolean | null
): void => {
  if (!config.persistToStorage || typeof window === 'undefined') return;
  
  try {
    const log: LogEntry = {
      level,
      component,
      message,
      timestamp: new Date(),
      data,
    };
    
    inMemoryLogs.push(log);
    
    // Hanya simpan ke localStorage setiap 10 log atau jika level ERROR
    if (inMemoryLogs.length % 10 === 0 || level === LogLevel.ERROR) {
      const existingLogs: LogEntry[] = JSON.parse(localStorage.getItem(`${config.storagePrefix}logs`) || '[]');
      const allLogs = [...existingLogs, ...inMemoryLogs];
      
      // Batasi jumlah log
      const trimmedLogs = allLogs.slice(-config.maxLogsInStorage);
      
      localStorage.setItem(`${config.storagePrefix}logs`, JSON.stringify(trimmedLogs));
      
      // Clear logs yang sudah disimpan dari memory
      inMemoryLogs.length = 0;
    }
  } catch (error) {
    // Sesuatu yang salah dengan localStorage - abaikan
    console.error('Error persisting logs:', error);
  }
};

// Function untuk menampilkan log di console dan menyimpannya
const logWithLevel = (
  level: LogLevel, 
  component: string, 
  message: string, 
  data?: Record<string, unknown> | string | number | boolean | null
): void => {
  if (level < config.level) return;
  
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${labels[level]}] [${component}]`;
  
  if (typeof window !== 'undefined' && window.console) {
    if (data) {
      console.log(`%c${prefix} ${message}`, colors[level], data);
    } else {
      console.log(`%c${prefix} ${message}`, colors[level]);
    }
  }
  
  persistLog(level, component, message, data);
};

// Public API
const logger = {
  debug: (component: string, message: string, data?: Record<string, unknown> | string | number | boolean | null): void => 
    logWithLevel(LogLevel.DEBUG, component, message, data),
    
  info: (component: string, message: string, data?: Record<string, unknown> | string | number | boolean | null): void => 
    logWithLevel(LogLevel.INFO, component, message, data),
    
  warn: (component: string, message: string, data?: Record<string, unknown> | string | number | boolean | null): void => 
    logWithLevel(LogLevel.WARN, component, message, data),
    
  error: (component: string, message: string, data?: Record<string, unknown> | string | number | boolean | null): void => 
    logWithLevel(LogLevel.ERROR, component, message, data),
    
  // Mengambil logs untuk debugging
  getLogs: (): LogEntry[] => {
    if (typeof window === 'undefined') return [];
    
    try {
      const storedLogs: LogEntry[] = JSON.parse(localStorage.getItem(`${config.storagePrefix}logs`) || '[]');
      return [...storedLogs, ...inMemoryLogs];
    } catch (error) {
      return inMemoryLogs;
    }
  },
  
  // Clear logs
  clearLogs: (): void => {
    if (typeof window === 'undefined') return;
    
    inMemoryLogs.length = 0;
    localStorage.removeItem(`${config.storagePrefix}logs`);
  }
};

export default logger; 