import React from 'react';
// import logger from '../../utils/logger';

interface FilterControlsProps {
  categories: string[];
  categoryFilter: string | null;
  completionFilter: 'all' | 'active' | 'completed';
  onCategoryFilterChange: (category: string | null) => void;
  onCompletionFilterChange: (status: 'all' | 'active' | 'completed') => void;
}

/**
 * Filter controls component for the todo application
 * Contains filters for completion status and categories
 */
const FilterControls: React.FC<FilterControlsProps> = ({
  categories,
  categoryFilter,
  completionFilter,
  onCategoryFilterChange,
  onCompletionFilterChange
}) => {
  
  const handleCompletionFilterChange = (status: 'all' | 'active' | 'completed') => {
    // logger.debug(`Completion filter changed to: ${status}`);
    onCompletionFilterChange(status);
  };
  
  const handleCategoryFilterChange = (category: string | null) => {
    // logger.debug(`Category filter changed to: ${category || 'all'}`);
    onCategoryFilterChange(category);
  };

  return (
    <>
      {/* Completion Status Filter */}
      <div className="border-t border-b border-gray-200 -mx-6 px-6 py-3 bg-gray-50 mb-4">
        <div className="flex flex-wrap items-center">
          <span className="text-sm font-medium text-gray-700 mr-3">View:</span>
          <div className="flex rounded-md shadow-sm mr-4">
            <button 
              onClick={() => handleCompletionFilterChange('all')}
              className={`px-3 py-1 text-sm rounded-l-md ${
                completionFilter === 'all' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button 
              onClick={() => handleCompletionFilterChange('active')}
              className={`px-3 py-1 text-sm ${
                completionFilter === 'active' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Active
            </button>
            <button 
              onClick={() => handleCompletionFilterChange('completed')}
              className={`px-3 py-1 text-sm rounded-r-md ${
                completionFilter === 'completed' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completed
            </button>
          </div>
        </div>
      </div>
      
      {/* Category Filter */}
      <div className="flex flex-wrap items-center mb-4">
        <span className="text-sm font-medium text-gray-700 mr-3">Filter by Category:</span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryFilterChange(null)}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              categoryFilter === null
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryFilterChange(cat)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                categoryFilter === cat
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default FilterControls; 