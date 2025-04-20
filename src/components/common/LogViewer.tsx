'use client';

import React, { useState, useEffect } from 'react';
import logger from '../../utils/logger';
import { X, Download, Trash2 } from 'lucide-react';

interface LogViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

const LogViewer: React.FC<LogViewerProps> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<Record<string, any>[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    if (isOpen) {
      refreshLogs();
    }
  }, [isOpen]);

  const refreshLogs = () => {
    const allLogs = logger.getLogs();
    setLogs(allLogs);
  };

  const clearLogs = () => {
    logger.clearLogs();
    setLogs([]);
  };

  const downloadLogs = () => {
    try {
      const logText = JSON.stringify(logs, null, 2);
      const blob = new Blob([logText], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `quicktodos-logs-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading logs:', error);
    }
  };

  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true;
    return log.level === parseInt(filter);
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg w-full max-w-4xl h-3/4 overflow-hidden flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Logs Aplikasi</h2>
          <div className="flex items-center space-x-2">
            <button 
              onClick={downloadLogs}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded"
              title="Download logs"
            >
              <Download size={18} />
            </button>
            <button 
              onClick={clearLogs}
              className="p-2 text-red-600 hover:bg-red-50 rounded"
              title="Clear logs"
            >
              <Trash2 size={18} />
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        
        <div className="p-4 border-b">
          <div className="flex items-center space-x-4">
            <label className="font-medium text-sm">Filter Level:</label>
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="all">Semua</option>
              <option value="0">Debug</option>
              <option value="1">Info</option>
              <option value="2">Warning</option>
              <option value="3">Error</option>
            </select>
            <button 
              onClick={refreshLogs}
              className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
            >
              Refresh
            </button>
          </div>
        </div>
        
        <div className="overflow-auto flex-1 p-4">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Tidak ada log yang tersedia.
            </div>
          ) : (
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-2">Waktu</th>
                  <th className="text-left p-2">Level</th>
                  <th className="text-left p-2">Komponen</th>
                  <th className="text-left p-2">Pesan</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log, index) => {
                  // Determine level text and style
                  let levelClass = '';
                  let levelText = '';
                  
                  switch(log.level) {
                    case 0:
                      levelClass = 'text-gray-600';
                      levelText = 'DEBUG';
                      break;
                    case 1:
                      levelClass = 'text-blue-600';
                      levelText = 'INFO';
                      break;
                    case 2:
                      levelClass = 'text-orange-600';
                      levelText = 'WARN';
                      break;
                    case 3:
                      levelClass = 'text-red-600 font-medium';
                      levelText = 'ERROR';
                      break;
                  }
                  
                  return (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-2 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className={`p-2 ${levelClass}`}>
                        {levelText}
                      </td>
                      <td className="p-2">
                        {log.component}
                      </td>
                      <td className="p-2">
                        <div>{log.message}</div>
                        {log.data && (
                          <pre className="text-xs bg-gray-100 p-1 mt-1 rounded overflow-auto max-h-20">
                            {typeof log.data === 'object' 
                              ? JSON.stringify(log.data, null, 2) 
                              : String(log.data)
                            }
                          </pre>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogViewer; 