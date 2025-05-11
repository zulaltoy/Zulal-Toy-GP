import React, { useEffect } from 'react'
import { useDispatch ,useSelector} from 'react-redux'
import { getAllBrands, filterByBrands } from '../store/slices/productSlice';


const SideBar = () => {
  const dispatch = useDispatch();
  const {brands,selectedBrands} = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getAllBrands());
  }, [dispatch]);

  const handleBrandChange =(brand,isChecked)=>{
    dispatch(filterByBrands({brand,isChecked}));
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">Filter by Brand</h2>
      <ul className="space-y-2">
        {brands.map((brand, index) => (
          <li key={index}>
            <label className="flex items-center space-x-2 cursor-pointer text-sm text-gray-600 hover:text-gray-800">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={(e) => handleBrandChange(brand, e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <span>{brand}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideBar