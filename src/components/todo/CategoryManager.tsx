import React, { useState } from 'react';
import { X } from 'lucide-react';
import logger from '../../utils/logger';

interface CategoryManagerProps {
  categories: string[];
  onAddCategory: (category: string) => void;
  onDeleteCategory: (category: string) => void;
}

const COMPONENT_NAME = 'CategoryManager';

/**
 * Category management component
 * Handles adding and deleting categories
 */
const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  onAddCategory,
  onDeleteCategory
}) => {
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategory(e.target.value);
  };

  const handleAddCategoryClick = () => {
    logger.debug(COMPONENT_NAME, 'Add category button clicked, showing input');
    setShowCategoryInput(true);
  };

  const handleCancelClick = () => {
    logger.debug(COMPONENT_NAME, 'Category add cancelled');
    setShowCategoryInput(false);
    setNewCategory('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedCategory = newCategory.trim();
    
    if (trimmedCategory && !categories.includes(trimmedCategory)) {
      logger.info(COMPONENT_NAME, `Adding new category: ${trimmedCategory}`);
      onAddCategory(trimmedCategory);
      setNewCategory('');
      setShowCategoryInput(false);
    } else if (categories.includes(trimmedCategory)) {
      logger.warn(COMPONENT_NAME, `Category already exists: ${trimmedCategory}`);
      alert('This category already exists!');
    } else {
      logger.warn(COMPONENT_NAME, 'Attempted to add empty category');
    }
  };

  const handleDeleteCategory = (category: string) => {
    if (category === 'Not Categorized') {
      logger.warn(COMPONENT_NAME, 'Attempted to delete default category');
      return;
    }
    
    logger.info(COMPONENT_NAME, `Deleting category: ${category}`);
    onDeleteCategory(category);
  };

  return (
    <div>
      <div className="flex items-center mb-2">
        <h3 className="text-sm font-medium text-gray-700 mr-3">Manage Categories:</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {/* Category Bubbles */}
        {categories.map(cat => (
          <div key={cat} className="relative inline-flex items-center group">
            <span className="px-3 py-1 text-xs rounded-full bg-gray-200 text-gray-800">
              {cat}
            </span>
            {cat !== 'Not Categorized' && (
              <button
                onClick={() => handleDeleteCategory(cat)}
                className="absolute -top-1 -right-1 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-opacity"
                aria-label={`Delete ${cat} category`}
              >
                <X size={12} strokeWidth={3} />
              </button>
            )}
          </div>
        ))}

        {/* Add Category Form/Button */}
        {showCategoryInput ? (
          <form 
            onSubmit={handleSubmit}
            className="flex items-center"
          >
            <input
              type="text"
              value={newCategory}
              onChange={handleInputChange}
              placeholder="New category"
              className="w-32 px-3 py-1 text-xs text-gray-900 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
            <button
              type="submit"
              className="px-2 py-1 text-xs bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700"
            >
              Add
            </button>
            <button
              type="button"
              onClick={handleCancelClick}
              className="ml-1 p-1 text-gray-400 hover:text-gray-600"
              aria-label="Cancel adding category"
            >
              <X size={14} />
            </button>
          </form>
        ) : (
          <button
            onClick={handleAddCategoryClick}
            className="px-3 py-1 text-xs rounded-full border border-dashed border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            + Add Category
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoryManager; 