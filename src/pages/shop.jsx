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
import { findProductToUpdateSuggestScore } from '../services/recommendersystem.service';
import { userState } from '../state';
import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil';
import { useLocation } from 'react-router-dom';

const ShopPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // Trạng thái tìm kiếm
  const [showInput, setShowInput] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);
  const inputRef = useRef(null);
  const topRef = useRef(null);
  const location = useLocation();

  const [isSuggestAPIActive, setIsSuggestAPIActive] = useState(false);
  const [currentSuggestPage, setCurrentSuggestPage] = useState(1);
  const [totalSuggestPages, setTotalSuggestPages] = useState(5);

  const [user, setUserState] = useRecoilState(userState);
  console.log(user);

  const fetchProducts = async (pageNumber, subCategory) => {
    const data = await getAllProduct(pageNumber, subCategory);
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
    const queryParams = new URLSearchParams(location.search);
    const categoryId = queryParams.get('category');
    const categoryName = queryParams.get('categoryName'); // Lấy tên danh mục từ URL
    if (categoryId) {
      setSelectedCategory(categoryName); // Thiết lập tên danh mục đã chọn
      fetchProducts(currentPage, categoryId); // Fetch sản phẩm theo category
      setShowFilter(true);
    } else {
      fetchProducts(currentPage); // Fetch tất cả sản phẩm nếu không có category
    }
    setIsSuggestAPIActive(false)
  }, [currentPage, location]);

  useEffect(() => {
    if (isSuggestAPIActive) {
      handleSearch(currentSuggestPage)
    }
  }, [currentSuggestPage]);

  useEffect(() => {
    //Cart được gọi
    getUserCart();
  }, []);

  const handlePageChange = (page) => {
    if (isSuggestAPIActive) {
      setCurrentSuggestPage(page);
      handleSearch(page);
    } else {
      setCurrentPage(page);
      fetchProducts(page);
    }
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearch = async (page) => {
    if (searchQuery) {
      try {
        const response = await findProductToUpdateSuggestScore(
          searchQuery,
          user.userInfo.id,
          page
        );

        if (response.products) {
          
          setProducts(response.products);
          setTotalSuggestPages(response.totalPages);
          setIsSuggestAPIActive(true)
        } else {
          setIsSuggestAPIActive(false)
        }
        
      } catch (error) {
        console.error('Error fetching product suggestions:', error);
      }
    } else {
      setIsSuggestAPIActive(false)
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
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

  return (
    <div>
      <Page ref={topRef} className="page relative">
        <Suspense>
          <Header />
          <div className="pt-4 my-14 relative">
            <div className="fixed top-[52px] left-0 z-10 w-full bg-white py-2">
              <div className="relative flex items-center justify-around">
                {/* Search button */}
                <button
                  onClick={handleSearchClick}
                  className={`px-4 py-3 rounded-md ${showInput
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-blue-500 border border-blue-500'
                    }`}
                >
                  <IoSearch size={24} />
                </button>

                {/*  FilterTags button */}
                <button
                  className={`px-4 py-3 rounded-md ${showFilter
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
                <div className="mt-3 mb-2 px-4">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    className="p-2 border rounded-md w-full  focus:outline-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  {searchQuery && (
                    <LiaTimesSolid
                      size={18}
                      className="absolute right-6 top-[88px] transform -translate-y-1/2 text-gray-400 cursor-pointer"
                      onClick={() => {
                        setSearchQuery('');
                        fetchProducts(1);
                      }} // Xóa nội dung khi nhấn vào X
                    />
                  )}
                </div>
              )}
              {/* Hiển thị FilterTags khi showFilter là true */}
              {showFilter && (
                <div className="mt-3 px-2">
                  <FilterTags
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                    fetchProducts={fetchProducts}
                  />
                </div>
              )}
            </div>
            <div className="pt-14 pb-8 min-h-screen bg-gray-100 w-full px-1">
              <ProductCard products={products} />

              {isSuggestAPIActive ? (
                <Pagination
                  currentPage={currentSuggestPage}
                  totalPages={totalSuggestPages}
                  onPageChange={handlePageChange}
                />
              ) : (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </div>
        </Suspense>
      </Page>
    </div>
  );
};

export default ShopPage;
