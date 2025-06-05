import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllCategories } from '../store/slices/categorySlice';
import { setSearchTerm, setSelectedCategory, resetSearch } from '../store/slices/searchSlice';

const SearchBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const categories = useSelector((state) => state.category.categories);
  const { searchTerm, selectedCategory } = useSelector((state) => state.search);
  const { categoryId } = useParams();

  useEffect(() => {
    if (categoryId && categories.length > 0) {
      const selected = categories.find((category) => category.id.toString() === categoryId);
      if (selected) {
        dispatch(setSelectedCategory(selected.name));
      } else {
        dispatch(setSelectedCategory('all'));
      }
    }
  }, [categoryId, categories, dispatch]);

  const handleCategoryChange = (event) => {
    dispatch(setSelectedCategory(event.target.value));
  };

  const handleSearchChange = (event) => {
    dispatch(setSearchTerm(event.target.value));
  };

  const handleResetSearch = () => {
    dispatch(resetSearch());
    navigate('/products');
  };

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 p-4 bg-white shadow-md rounded-md">
      <select
        value={selectedCategory}
        onChange={handleCategoryChange}
        className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
      >
        <option value="all">All Category</option>
        {categories.map((category, index) => (
          <option key={index} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>

      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search... for products"
        className="border border-gray-300 rounded-md px-4 py-1 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-amber-500"
      />

      <button
        onClick={handleResetSearch}
        className="bg-amber-500 text-white px-4 py-1 rounded-md hover:bg-amber-600 transition-colors text-sm"
      >
        Clear Search
      </button>
    </div>
  );
};

export default SearchBar;
