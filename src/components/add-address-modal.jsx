// Modal.js
import React, { useEffect, useState } from 'react';
import vietnamAddressData from '../utils/tree.json';
import { FaTimes } from 'react-icons/fa';

const AddAddressModal = ({ isOpen, onClose }) => {
  const [address, setAddress] = useState({
    city: '',
    district: '',
    ward: '',
    number: '',
  });

  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  // Lấy danh sách thành phố từ dữ liệu
  const cities = Object.values(vietnamAddressData);

  // Cập nhật danh sách quận/huyện khi chọn thành phố
  const handleCityChange = (e) => {
    const selectedCityCode = e.target.value;
    const selectedCity = vietnamAddressData[selectedCityCode];

    setAddress({
      ...address,
      city: selectedCity?.name || '',
      district: '',
      ward: '',
    });

    // Lấy danh sách quận/huyện tương ứng
    if (selectedCity) {
      setDistricts(Object.values(selectedCity['quan-huyen']));
    }
  };

  // Cập nhật danh sách phường/xã khi chọn quận/huyện
  const handleDistrictChange = (e) => {
    const selectedDistrictCode = e.target.value;
    const selectedDistrict = districts.find(
      (district) => district.code === selectedDistrictCode
    );

    setAddress({
      ...address,
      district: selectedDistrict?.name || '',
      ward: '',
    });

    // Lấy danh sách phường/xã tương ứng
    if (selectedDistrict) {
      setWards(Object.values(selectedDistrict['xa-phuong']));
    }
  };

  const handleWardChange = (e) => {
    const selectedWardCode = e.target.value;
    const selectedWard = wards.find((ward) => ward.code === selectedWardCode);

    setAddress({ ...address, ward: selectedWard?.name || '' });
  };

  const handleAddressNumberChange = (e) => {
    setAddress({ ...address, number: e.target.value });
  };
  console.log('address', address);
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
    >
      <div className="bg-white rounded-lg p-6 max-w-md w-4/5">
        <button
          onClick={onClose}
          className="text-red-500 ml-auto p-1 rounded-full bg-gray-300 float-right"
        >
          <FaTimes />
        </button>
        <div className="mt-6">
          {/* Select cho thành phố */}
          <select
            name="city"
            className="px-4 py-2 border rounded-xl w-full mb-2 focus:outline-blue-500 mt-4"
            onChange={handleCityChange}
          >
            <option value="">Chọn thành phố</option>
            {cities.map((city) => (
              <option key={city.code} value={city.code}>
                {city.name}
              </option>
            ))}
          </select>

          {/* Select cho quận/huyện */}
          <select
            name="district"
            className="px-4 py-2 border rounded-xl w-full mb-2 focus:outline-blue-500"
            onChange={handleDistrictChange}
          >
            <option value="">Chọn quận/huyện</option>
            {districts.map((district) => (
              <option key={district.code} value={district.code}>
                {district.name}
              </option>
            ))}
          </select>

          {/* Select cho phường/xã */}
          <select
            name="ward"
            className="px-4 py-2 border rounded-xl w-full mb-2 focus:outline-blue-500"
            onChange={handleWardChange}
          >
            <option value="">Chọn phường/xã</option>
            {wards.map((ward) => (
              <option key={ward.code} value={ward.code}>
                {ward.name}
              </option>
            ))}
          </select>

          {/* Input cho số nhà */}
          <input
            type="text"
            name="number"
            placeholder="Số nhà"
            className="px-4 py-2 border rounded-xl w-full mb-4 focus:outline-blue-500"
            value={address.number}
            onChange={handleAddressNumberChange}
          />

          <div className="flex justify-center mt-4">
            <button className="bg-blue-500 px-4 py-2 rounded-xl  text-white">
              Thêm địa chỉ giao hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAddressModal;
