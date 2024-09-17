import React, { Suspense, useState } from 'react';
import { Button, Input, Box, Page, useSnackbar } from 'zmp-ui';
import { useNavigate } from 'react-router';
import Taskbar from '../components/taskbar';
import FilterTags from '../components/filtertag';
import anh1 from '../assets/img/example1.jpg';
import anh2 from '../assets/img/example2.jpg';

const products = [
  {
    id: 1,
    name: 'Kem Dưỡng Mặt',
    price: 250000,
    type: 'Mặt',
    image: anh1,
  },
  {
    id: 2,
    name: 'Serum Mắt',
    price: 300000,
    type: 'Mắt',
    image: anh1,
  },
  {
    id: 3,
    name: 'Son Môi',
    price: 150000,
    type: 'Môi',
    image: anh2,
  },
  {
    id: 4,
    name: 'Dầu Dưỡng Tóc',
    price: 200000,
    type: 'Tóc',
    image: anh2,
  },
  {
    id: 5,
    name: 'Mặt Nạ Đắp Mặt',
    price: 180000,
    type: 'Mặt',
    image: anh2,
  },
  {
    id: 6,
    name: 'Kem Chống Nắng',
    price: 220000,
    type: 'Mặt',
    image: anh2,
  },
  {
    id: 7,
    name: 'Tinh Dầu Mắt',
    price: 280000,
    type: 'Mắt',
    image: anh2,
  },
  {
    id: 8,
    name: 'Xịt Tóc Bổ Sung',
    price: 170000,
    type: 'Tóc',
    image: anh2,
  },
];

const ShopPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');

  const filteredProducts =
    selectedCategory === 'Tất cả'
      ? products
      : products.filter((product) => product.type === selectedCategory);

  return (
    <div>
      <Page className="page">
        <Suspense>
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Danh Sách Sản Phẩm</h1>
            <FilterTags
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
            <div className="scroll-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="border rounded-lg p-4 bg-white shadow-md flex flex-col items-center"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-32 h-32 object-contain mb-4 rounded"
                  />
                  <h2 className="text-xl font-semibold mb-2 text-center">
                    {product.name}
                  </h2>
                  <p className="text-gray-700 mb-2 text-center">
                    Giá: {product.price.toLocaleString()} VNĐ
                  </p>
                  <p className="text-gray-500 text-center">
                    Loại: {product.type}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Suspense>
      </Page>

      <Taskbar />
    </div>
  );
};

export default ShopPage;
