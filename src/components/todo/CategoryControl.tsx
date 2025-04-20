import React, { useState } from 'react';
import { X, Plus, Check } from 'lucide-react';
import logger from '../../utils/logger';

interface CategoryControlProps {
  categories: string[];
  categoryFilter: string | null;
  onCategoryFilterChange: (category: string | null) => void;
  onAddCategory: (category: string) => void;
  onDeleteCategory: (category: string) => void;
}

const COMPONENT_NAME = 'CategoryControl';

/**
 * Unified component for managing and filtering by categories
 */
const CategoryControl: React.FC<CategoryControlProps> = ({
  categories,
  categoryFilter,
  onCategoryFilterChange,
  onAddCategory,
  onDeleteCategory
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  const handleCategoryClick = (category: string | null) => {
    logger.debug(COMPONENT_NAME, `Category ${category || 'All'} clicked for filtering`);
    onCategoryFilterChange(category);
  };

  const handleAddClick = () => {
    setIsAdding(true);
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewCategory('');
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedCategory = newCategory.trim();
    
    if (trimmedCategory && !categories.includes(trimmedCategory)) {
      logger.info(COMPONENT_NAME, `Adding new category: ${trimmedCategory}`);
      onAddCategory(trimmedCategory);
      setNewCategory('');
      setIsAdding(false);
    } else if (categories.includes(trimmedCategory)) {
      logger.warn(COMPONENT_NAME, `Category already exists: ${trimmedCategory}`);
      alert('This category already exists!');
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, category: string) => {
    e.stopPropagation();
    
    if (category === 'Not Categorized') {
      logger.warn(COMPONENT_NAME, 'Attempted to delete default category');
      return;
    }
    
    logger.info(COMPONENT_NAME, `Deleting category: ${category}`);
    onDeleteCategory(category);
  };

  return (
    <div className="mt-5">
      <div className="flex flex-wrap gap-2">
        {/* "All" category option */}
        <div 
          className={`px-4 py-2 rounded-full cursor-pointer transition-all flex items-center shadow-sm
            ${categoryFilter === null 
              ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-200' 
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          onClick={() => handleCategoryClick(null)}
        >
          <span className="text-sm font-medium">All</span>
          {categoryFilter === null && (
            <Check className="w-3.5 h-3.5 ml-1.5" />
          )}
        </div>

        {/* Category pills with filtering and delete capability */}
        {categories.map(category => (
          <div 
            key={category}
            className={`px-4 py-2 rounded-full cursor-pointer transition-all flex items-center gap-1.5 shadow-sm
              ${categoryFilter === category 
                ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-200' 
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            onClick={() => handleCategoryClick(category)}
          >
            <span className="text-sm font-medium">{category}</span>
            
            {/* Selected indicator */}
            {categoryFilter === category && (
              <Check className="w-3.5 h-3.5" />
            )}
            
            {/* Delete button */}
            {category !== 'Not Categorized' && (
              <button
                onClick={(e) => handleDeleteClick(e, category)}
                className={`ml-0.5 p-0.5 rounded-full transition-colors ${
                  categoryFilter === category
                    ? 'text-white/70 hover:text-white hover:bg-white/20'  
                    : 'text-gray-400 hover:text-red-500 hover:bg-gray-100'
                }`}
                aria-label={`Delete ${category} category`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}

        {/* Add category interface */}
        {isAdding ? (
          <form 
            onSubmit={handleAddSubmit}
            className="inline-flex items-center rounded-full border border-gray-200 bg-white shadow-sm overflow-hidden"
          >
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category"
              className="w-48 px-4 py-2 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:bg-white"
              autoFocus
            />
            <button
              type="button"
              onClick={handleCancelAdd}
              className="h-full px-3 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Cancel adding category"
            >
              <X className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <button
            onClick={handleAddClick}
            className="px-4 py-2 rounded-full shadow-sm border border-dashed border-gray-300 text-gray-600 hover:bg-gray-50 flex items-center transition-all"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            <span className="text-sm font-medium">Add category</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoryControl; 