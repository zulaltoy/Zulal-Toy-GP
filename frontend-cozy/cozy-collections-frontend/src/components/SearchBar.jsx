import React, {  useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom';
import { getAllCategories } from '../store/slices/categorySlice';
import { setSearchTerm, setSelectedCategory ,resetSearch} from '../store/slices/searchSlice';

const SearchBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const categories = useSelector((state) => state.categories.categories);

  const {searchTerm,selectedCategory} = useSelector((state) => state.search);
  const {categoryId} = useParams();

  useEffect(() => {
    if(categoryId && categories.length > 0){
      const selectedCategory = categories.find((category) => category.id === categoryId);

      if(selectedCategory){
        dispatch(setSelectedCategory(selectedCategory.name));
      }else{
        dispatch(setSelectedCategory("all"));
      }
    }
  }
  , [categoryId, categories, dispatch]);
  const handleCategoryChange = (event) => {
    dispatch(setSelectedCategory(event.target.value));
  };

  const handleSearchChange = (event) => {
    dispatch(setSearchTerm(event.target.value));
  }
  const handleResetSearch = () => {
    dispatch(resetSearch());
    navigate("/products");
  };
  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 mt-4 w-full">

      <select value={selectedCategory} onChange={handleCategoryChange} className="border border-gray-300 rounded-md p-2">
        <option value="all">All Categories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>
      <input
      type='text'
      value={searchTerm}
      onChange={handleSearchChange}
      placeholder='Search... for products'
      className="px-3 py-2 border border-gray-300 rounded-md text-sm w-full md:flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleResetSearch}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
      >
        Clear Search
      </button>
    </div>
  )
}

export default SearchBar