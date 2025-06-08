import React, { useEffect, useState } from "react";
import { useFormikContext } from "formik";
import { useDispatch } from "react-redux";
import { getCountryNames } from "../store/slices/userSlice";

const AddressForm = ({ index, removeAddress }) => {
  const dispatch = useDispatch();
  const [countries, setCountries] = useState([]);
  const { values, handleChange } = useFormikContext();

  useEffect(() => {
    const fetchCountries = async () => {
      const response = await dispatch(getCountryNames()).unwrap();
      setCountries(response);
    };
    fetchCountries();
  }, [dispatch]);

  const prefix = `addresses[${index}]`;

  return (
    <div className="border p-4 rounded mb-4">
      <h4 className="font-semibold mb-3">Address {index + 1}</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Street</label>
          <input
            name={`${prefix}.street`}
            value={values.addresses[index].street}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">City</label>
          <input
            name={`${prefix}.city`}
            value={values.addresses[index].city}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Zip</label>
          <input
            name={`${prefix}.zip`}
            value={values.addresses[index].zip}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Country</label>
          <select
            name={`${prefix}.country`}
            value={values.addresses[index].country}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select country</option>
            {countries.map((country, idx) => (
              <option key={idx} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

    
      </div>

      <button
        type="button"
        onClick={() => removeAddress(index)}
        className="mt-3 text-red-600 underline"
      >
        Remove Address
      </button>
    </div>
  );
};

export default AddressForm;
