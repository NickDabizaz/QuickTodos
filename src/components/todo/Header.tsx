'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Link as LinkIcon, ListTodo } from 'lucide-react';
import logger from '../../utils/logger';

interface HeaderProps {
  listId: string;
  onShareClick: () => void;
  isLinkCopied: boolean;
}

const COMPONENT_NAME = 'TodoHeader';

/**
 * Header component for the todo application
 * Contains navigation, title, and sharing button
 */
const Header: React.FC<HeaderProps> = ({
  listId,
  onShareClick,
  isLinkCopied
}) => {
  const router = useRouter();

  const handleBackClick = () => {
    logger.debug(COMPONENT_NAME, 'Back button clicked, navigating to home');
    router.push('/');
  };

  return (
    <nav className="bg-white border-b shadow-sm p-4 px-6 md:px-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left side: Back button and Logo */}
        <div className="flex items-center">
          <button 
            onClick={handleBackClick} 
            className="flex items-center text-gray-600 hover:text-indigo-600 mr-3"
            aria-label="Go back to home"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <Link href="/" className="flex items-center">
            <div className="flex items-center">
              <ListTodo className="h-6 w-6 text-indigo-600 mr-2" />
              <h1 className="text-xl font-bold text-indigo-600">QuickTodos</h1>
            </div>
          </Link>
        </div>

        {/* Center: Room ID (for medium screens) */}
        <div className="hidden md:flex items-center">
          <span className="text-sm text-gray-600">
            Room: <span className="font-medium text-indigo-600">{listId}</span>
          </span>
        </div>
        
        {/* Right side: Share button */}
        <div>
          <button
            onClick={onShareClick}
            className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition"
            aria-label="Share room URL"
          >
            <LinkIcon className="h-4 w-4 mr-1.5" />
            {isLinkCopied ? 'Copied!' : 'Share Link'}
          </button>
        </div>
      </div>
      
      {/* Mobile Room ID Banner */}
      <div className="md:hidden flex justify-center mt-2">
        <span className="text-xs text-gray-600">
          Room: <span className="font-medium text-indigo-600">{listId}</span>
        </span>
      </div>
    </nav>
  );
};

export default Header; 