import React, {
  Suspense,
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
} from 'react';
import { Button, Input, Box, Page, useSnackbar } from 'zmp-ui';
import FilterTags from '../components/filter-tag';
import { IoSearch } from 'react-icons/io5';
import { LiaTimesSolid } from 'react-icons/lia';
import { IoFilter } from 'react-icons/io5';
import { IoCart } from 'react-icons/io5';
import { Link } from 'react-router-dom';
// import { products } from '../utils/productdemo';
import Header from '../components/header';
import ProductCard from '../components/product-card';
import Pagination from '../components/pagination';
import { getAllProduct } from '../services/product.service';
import { fetchUserCart } from '../services/cart.service';
import { userState } from '../state';
import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil';

const ShopPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // Trạng thái tìm kiếm
  const [showInput, setShowInput] = useState(false);
  const [products, setProducts] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);
  const inputRef = useRef(null);
  const topRef = useRef(null);

  const [user, setUserState] = useRecoilState(userState);
  console.log(user);

  const fetchProducts = async (pageNumber) => {
    const data = await getAllProduct(pageNumber);
    console.log(data);

    if (data) {
      setProducts(data.products); // Gán giá trị cho products
    } else {
      console.error('Failed to fetch product data');
    }
  };

  const getUserCart = async () => {
    const cart = await fetchUserCart(user.accessToken);
    if (cart) {
      console.log(cart.carts.length);
      setCartCount(cart.carts.length);
    } else {
      throw new Error('Failed to fetch cart data');
    }
  };

  useEffect(() => {
    //useeffect đượcgọi lại mỗi khi trang thay đổi
    fetchProducts(currentPage);
  }, [currentPage]);

  // useEffect(() => {
  //   //Cart được gọi
  //   getUserCart();
  // }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Lọc sản phẩm theo danh mục và tên
  const filteredProducts = products
    ? products.filter((product) => {
        // Lọc sản phẩm dựa trên loại được chọn
        if (selectedCategory === 'Tất cả') return true;

        // Danh sách từ khóa cho mỗi loại
        const keywords = {
          Mặt: ['mặt', 'da', 'mụn'],
          Mắt: ['mắt', 'kính'],
          Môi: ['môi', 'son'],
          Tóc: ['tóc', 'dầu gội', 'dưỡng', 'dầu xả'],
          Da: ['da', 'kem dưỡng', 'body'],
        };

        // Lấy danh sách từ khóa cho loại sản phẩm đã chọn
        const selectedKeywords = keywords[selectedCategory] || [];

        // Kiểm tra xem sản phẩm có category chứa bất kỳ từ khóa nào không
        return selectedKeywords.some((keyword) => {
          return (
            product.category &&
            typeof product.category === 'string' &&
            product.category.toLowerCase().includes(keyword.toLowerCase())
          );
        });
      })
    : [];

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
      <Page ref={topRef} className="page relative">
        <Suspense>
          <Header />
          <div className="p-4 mt-14 mb-14">
            <p className="text-4xl font-black mb-4 ">
              <strong>Danh Sách Sản Phẩm</strong>
            </p>

            <div className="mb-2">
              <div className="relative flex items-center justify-around mb-4">
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
                <button className="w-1/2 px-4 py-2 rounded-md bg-blue-500 text-white active:bg-blue-300">
                  <Link
                    to={`/cart`}
                    className="w-auto flex  items-center justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <IoCart size={24} />
                      <span className="ml-1 text-lg">Giỏ hàng</span>
                    </div>
                    <span className="border border-white text-white rounded-full  text-base w-8 h-8 flex items-center justify-center">
                      {cartCount}
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

            <ProductCard productList={filteredProducts} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </Suspense>
      </Page>
    </div>
  );
};

export default ShopPage;
