import React from 'react';
import { MoveVertical, Heart, Cloud } from 'lucide-react';
import Link from 'next/link';

interface FooterProps {
  showDragHint?: boolean;
}

/**
 * Footer component for the todo application
 */
const Footer: React.FC<FooterProps> = ({ showDragHint = true }) => {
  return (
    <>
      {/* Drag hint - hanya ditampilkan jika showDragHint true */}
      {showDragHint && (
        <div className="flex justify-center mt-6 mb-8">
          <div className="flex items-center py-2 px-4 bg-indigo-50 rounded-full text-sm text-indigo-600 shadow-sm">
            <MoveVertical className="w-4 h-4 mr-2 animate-pulse" />
            Drag and drop tasks to reorder them
          </div>
        </div>
      )}
      
      {/* Main footer - full width dengan pendekatan yang lebih baik */}
      <footer className="w-full bg-gray-800 text-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <span className="text-xl font-bold text-white mr-2">QuickTodos</span>
                <div className="flex items-center bg-blue-900/30 px-2 py-1 rounded-full">
                  <Cloud className="h-3 w-3 text-blue-400 mr-1" />
                  <span className="text-xs font-medium text-blue-300">Cloud Storage</span>
                </div>
              </div>
              <p className="text-gray-400 mt-1">Simple, collaborative task management</p>
            </div>
            
            <div className="flex space-x-6">
              <Link href="/" className="text-gray-400 hover:text-white text-sm">
                Home
              </Link>
              <Link href="/#features" className="text-gray-400 hover:text-white text-sm">
                Features
              </Link>
              <Link href="/#about" className="text-gray-400 hover:text-white text-sm">
                About
              </Link>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-6 pt-6 text-center text-gray-400">
            <p>© {new Date().getFullYear()} QuickTodos. All rights reserved.</p>
            <p className="mt-2 flex items-center justify-center">
              Made with <Heart className="h-3 w-3 mx-1 text-red-400 fill-red-400" /> by our team
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer; 