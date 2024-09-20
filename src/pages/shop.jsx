import React, { Suspense, useState, useRef } from 'react';
import { Button, Input, Box, Page, useSnackbar } from 'zmp-ui';
import FilterTags from '../components/filtertag';
import { IoSearch } from 'react-icons/io5';
import { LiaTimesSolid } from 'react-icons/lia';
import { IoFilter } from 'react-icons/io5';
import { IoCart } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { products } from '../utils/productdemo';

const ShopPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // Trạng thái tìm kiếm
  const [showInput, setShowInput] = useState(false);

  const inputRef = useRef(null);

  // Lọc sản phẩm theo danh mục và tên
  const filteredProducts = products
    .filter((product) =>
      selectedCategory === 'Tất cả' ? true : product.type === selectedCategory
    )
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) // Lọc theo tên sản phẩm
    );

  // Xử lý khi nhấn vào nút tìm kiếm
  const handleSearchClick = () => {
    setShowInput(!showInput);
    setTimeout(() => {
      if (!showInput) {
        inputRef.current.focus();
      }
    }, 100);
  };

  return (
    <div>
      <Page className="page scroll-container">
        <Suspense>
          <div className="p-4">
            <h1 className="text-4xl font-bold mb-4 custom-font ">
              Danh Sách Sản Phẩm
            </h1>

            <div className="mb-2">
              <div className="relative flex items-center justify-between mb-4">
                {/* Search button */}
                <button
                  onClick={handleSearchClick}
                  className={`px-4 py-3 rounded-md  ${
                    showInput
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-blue-500 border border-blue-500'
                  }`}
                >
                  <IoSearch size={24} />
                </button>

                {/*  FilterTags button */}
                <button
                  className={`px-4 py-3 rounded-md ${
                    showFilter
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-blue-500 border border-blue-500'
                  }`}
                  onClick={() => setShowFilter(!showFilter)}
                >
                  <IoFilter size={24} />
                </button>

                {/*  Cart button */}
                <button className="w-1/2 px-4 py-2 rounded-md bg-blue-500 text-white ">
                  <Link
                    to={`/cart`}
                    className="w-auto flex  items-center justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <IoCart size={24} />
                      <span className="ml-1 text-lg">Cart</span>
                    </div>
                    <span className="border border-white text-white rounded-full  text-base w-8 h-8 flex items-center justify-center">
                      3
                    </span>
                  </Link>
                </button>
              </div>
              {showInput && (
                <div className="relative mb-2">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    className="p-2 border rounded-md w-full  focus:outline-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <LiaTimesSolid
                      size={18}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                      onClick={() => setSearchQuery('')} // Xóa nội dung khi nhấn vào X
                    />
                  )}
                </div>
              )}
              {/* Hiển thị FilterTags khi showFilter là true */}
              {showFilter && (
                <FilterTags
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />
              )}
            </div>

            <div className="scroll-container grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <Link
                  to={`/product/${product.id}`}
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
                </Link>
              ))}
            </div>
          </div>
        </Suspense>
      </Page>
    </div>
  );
};

export default ShopPage;
