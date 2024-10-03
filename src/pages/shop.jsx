// import React, { Suspense, useState, useRef } from 'react';
// import { Button, Input, Box, Page, useSnackbar } from 'zmp-ui';
// import FilterTags from '../components/filter-tag';
// import { IoSearch } from 'react-icons/io5';
// import { LiaTimesSolid } from 'react-icons/lia';
// import { IoFilter } from 'react-icons/io5';
// import { IoCart } from 'react-icons/io5';
// import { Link } from 'react-router-dom';
// import { products } from '../utils/productdemo';
// import Header from '../components/header';
// import ProductCard from '../components/product-card';

// const ShopPage = () => {
//   const [selectedCategory, setSelectedCategory] = useState('Tất cả');
//   const [showFilter, setShowFilter] = useState(false);
//   const [searchQuery, setSearchQuery] = useState(''); // Trạng thái tìm kiếm
//   const [showInput, setShowInput] = useState(false);

//   const inputRef = useRef(null);

//   // Lọc sản phẩm theo danh mục và tên
//   const filteredProducts = products
//     .filter((product) =>
//       selectedCategory === 'Tất cả' ? true : product.type === selectedCategory
//     )
//     .filter(
//       (product) =>
//         product.name.toLowerCase().includes(searchQuery.toLowerCase()) // Lọc theo tên sản phẩm
//     );

//   // Xử lý khi nhấn vào nút tìm kiếm
//   const handleSearchClick = () => {
//     setShowInput(!showInput);
//     setTimeout(() => {
//       if (!showInput) {
//         inputRef.current.focus();
//       }
//     }, 100);
//   };

//   return (
//     <div>
//       <Page className="page relative">
//         <Suspense>
//         <Header />
//           <div className="p-4 mt-14 mb-14">
//             <h1 className="text-4xl font-bold mb-4 custom-font ">
//               Danh Sách Sản Phẩm
//             </h1>

//             <div className="mb-2">
//               <div className="relative flex items-center justify-around mb-4">
//                 {/* Search button */}
//                 <button
//                   onClick={handleSearchClick}
//                   className={`px-4 py-3 rounded-md  ${
//                     showInput
//                       ? 'bg-blue-500 text-white'
//                       : 'bg-white text-blue-500 border border-blue-500'
//                   }`}
//                 >
//                   <IoSearch size={24} />
//                 </button>

//                 {/*  FilterTags button */}
//                 <button
//                   className={`px-4 py-3 rounded-md ${
//                     showFilter
//                       ? 'bg-blue-500 text-white'
//                       : 'bg-white text-blue-500 border border-blue-500'
//                   }`}
//                   onClick={() => setShowFilter(!showFilter)}
//                 >
//                   <IoFilter size={24} />
//                 </button>

//                 {/*  Cart button */}
//                 <button className="w-1/2 px-4 py-2 rounded-md bg-blue-500 text-white ">
//                   <Link
//                     to={`/cart`}
//                     className="w-auto flex  items-center justify-between"
//                   >
//                     <div className="flex items-center justify-between">
//                       <IoCart size={24} />
//                       <span className="ml-1 text-lg">Giỏ hàng</span>
//                     </div>
//                     <span className="border border-white text-white rounded-full  text-base w-8 h-8 flex items-center justify-center">
//                       3
//                     </span>
//                   </Link>
//                 </button>
//               </div>
//               {showInput && (
//                 <div className="relative mb-2">
//                   <input
//                     ref={inputRef}
//                     type="text"
//                     placeholder="Tìm kiếm sản phẩm..."
//                     className="p-2 border rounded-md w-full  focus:outline-blue-500"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                   />
//                   {searchQuery && (
//                     <LiaTimesSolid
//                       size={18}
//                       className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
//                       onClick={() => setSearchQuery('')} // Xóa nội dung khi nhấn vào X
//                     />
//                   )}
//                 </div>
//               )}
//               {/* Hiển thị FilterTags khi showFilter là true */}
//               {showFilter && (
//                 <FilterTags
//                   selectedCategory={selectedCategory}
//                   onSelectCategory={setSelectedCategory}
//                 />
//               )}
//             </div>

//             <ProductCard productList={filteredProducts} />
//           </div>
//         </Suspense>
//       </Page>
//     </div>
//   );
// };

// export default ShopPage;



////////////////////

import React, { Suspense, useState, useRef } from 'react';
import { Button, Input, Box, Page, useSnackbar } from 'zmp-ui';
import FilterTags from '../components/filter-tag';
import { IoSearch } from 'react-icons/io5';
import { LiaTimesSolid } from 'react-icons/lia';
import { IoFilter } from 'react-icons/io5';
import { IoCart } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { findProductToUpdateSuggestScore } from '../services/recommendersystem.service';
import Header from '../components/header';
import ProductCard from '../components/product-card';

const ShopPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // Trạng thái tìm kiếm
  const [showInput, setShowInput] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]); // Cập nhật danh sách sản phẩm từ API

  const inputRef = useRef(null);

  // Gọi API để tìm sản phẩm
  const handleSearch = async (query) => {
    try {
      const products = await findProductToUpdateSuggestScore(query); // Gọi API tìm kiếm
      setFilteredProducts(products); // Cập nhật danh sách sản phẩm từ API
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  // Xử lý khi nhấn vào nút tìm kiếm
  const handleSearchClick = () => {
    setShowInput(!showInput);
    setTimeout(() => {
      if (!showInput) {
        inputRef.current.focus();
      }
    }, 100);
  };

  // Xử lý thay đổi tìm kiếm
  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query) {
      handleSearch(query); // Gọi API khi có từ khóa tìm kiếm
    } else {
      setFilteredProducts([]); // Xóa kết quả tìm kiếm nếu từ khóa rỗng
    }
  };

  return (
    <div>
      <Page className="page relative">
        <Suspense>
          <Header />
          <div className="p-4 mt-14 mb-14">
            <h1 className="text-4xl font-bold mb-4 custom-font">
              Danh Sách Sản Phẩm
            </h1>

            <div className="mb-2">
              <div className="relative flex items-center justify-around mb-4">
                {/* Search button */}
                <button
                  onClick={handleSearchClick}
                  className={`px-4 py-3 rounded-md ${
                    showInput
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-blue-500 border border-blue-500'
                  }`}
                >
                  <IoSearch size={24} />
                </button>

                {/* FilterTags button */}
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

                {/* Cart button */}
                <button className="w-1/2 px-4 py-2 rounded-md bg-blue-500 text-white">
                  <Link
                    to={`/cart`}
                    className="w-auto flex  items-center justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <IoCart size={24} />
                      <span className="ml-1 text-lg">Giỏ hàng</span>
                    </div>
                    <span className="border border-white text-white rounded-full text-base w-8 h-8 flex items-center justify-center">
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
                    className="p-2 border rounded-md w-full focus:outline-blue-500"
                    value={searchQuery}
                    onChange={handleInputChange} // Gọi khi thay đổi input
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

            {/* Hiển thị danh sách sản phẩm */}
            <ProductCard productList={filteredProducts} />
          </div>
        </Suspense>
      </Page>
    </div>
  );
};

export default ShopPage;
