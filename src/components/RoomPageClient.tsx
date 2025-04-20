'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Share, Copy, CheckCircle, X } from 'lucide-react';
import TodoList from './TodoList';
import Header from './todo/Header';
import Footer from './todo/Footer';

const RoomPageClient: React.FC = () => {
  const pathname = usePathname();
  const roomId = pathname?.substring(1);
  const [showModal, setShowModal] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  
  const handleShareClick = () => {
    const url = `${window.location.origin}${pathname}`;
    navigator.clipboard.writeText(url);
    setIsLinkCopied(true);
    setShowModal(true);
    
    // Reset the copied state after 3 seconds
    setTimeout(() => {
      setIsLinkCopied(false);
    }, 3000);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      {/* Header */}
      <Header 
        listId={roomId || ''} 
        onShareClick={handleShareClick}
        isLinkCopied={isLinkCopied}
      />
      
      {/* Main Content */}
      <main className="flex-1 pb-16 pt-6">
        <TodoList />
      </main>

      {/* Footer */}
      <Footer showDragHint={true} />

      {/* Share Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backdropFilter: 'blur(3px)', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
            
            <div className="text-center mb-4">
              {isLinkCopied ? (
                <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-2" />
              ) : (
                <Share className="h-12 w-12 mx-auto text-indigo-500 mb-2" />
              )}
              <h3 className="text-xl font-bold text-gray-900">
                {isLinkCopied ? 'Link Copied!' : 'Share This Room'}
              </h3>
            </div>
            
            <p className="text-gray-600 mb-4 text-center">
              {isLinkCopied 
                ? 'The link has been copied to your clipboard.' 
                : 'Share this unique URL with others to collaborate on this todo list:'}
            </p>
            
            <div className="flex items-center bg-gray-100 p-3 rounded-md mb-4">
              <span className="text-gray-700 flex-1 truncate mr-2">
                {`${window.location.origin}${pathname}`}
              </span>
              <button
                onClick={handleShareClick}
                className="flex items-center bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-3 py-1.5 rounded-md"
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </button>
            </div>
            
            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition"
            >
              {isLinkCopied ? 'Close' : 'Done'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomPageClient; 