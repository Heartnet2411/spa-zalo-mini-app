// src/pages/ProductDetail.js
import React, { Suspense, useState, useRef, useEffect } from 'react';
import { Page, Swiper, Box, Text, Button, Icon } from 'zmp-ui';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { products } from '../utils/productdemo';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { MdOutlineAddShoppingCart } from 'react-icons/md';
import { IoBagCheckOutline } from 'react-icons/io5';
import { IoReturnDownBack } from 'react-icons/io5';
import { getProductById } from '../services/product.service';
import { addToCart } from '../services/cart.service';
import { fetchProductRecommendations } from '../services/product.service';
import ProductCard from '../components/product-card';
import { useRecoilState } from 'recoil';
import { userState } from '../state';
import { getProductReviews } from '../services/rating.service';
import StarRating from '../components/star-rating';
import Pagination from '../components/pagination';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [productRecommendation, setProductRecommendation] = useState(null);
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [currentReviewPage, setCurrentReviewPage] = useState(1);
  const [totalReviewPages, setTotalReviewPages] = useState(1);
  const [totalReviews, setTotalReviews] = useState(1);

  const [selectedImage, setSelectedImage] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const [isExpanded, setIsExpanded] = useState(false);
  const descriptionRef = useRef(null);
  const [showToggleButton, setShowToggleButton] = useState(false);

  const [user, setUserState] = useRecoilState(userState);

  const handlePayment = () => {
    const cart = [
      {
        productId: product._id,
        variantId: selectedVariant ? selectedVariant._id : null,
        price: selectedVariant ? selectedVariant.price : product.price,
        quantity: count,
        images: product.images,
        productName: product.name,
      },
    ];
    navigate('/payment', {
      state: {
        cart,
      },
    });
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const fetchedProduct = await getProductById(id); // Gọi hàm để lấy sản phẩm
        if (fetchedProduct) {
          setProduct(fetchedProduct);
          console.log(fetchProduct);
          setSelectedVariant(fetchedProduct.variants[0]);
        } else {
          throw new Error('Không tìm thấy sản phẩm.'); // Ném lỗi nếu không tìm thấy sản phẩm
        }
      } catch (err) {
        console.error(err);
        // setError(err.message); // Cập nhật state với thông điệp lỗi
      } finally {
        setLoading(false); // Cập nhật trạng thái loading
      }
    };

    const fetchProductRecommendation = async () => {
      try {
        const recommend = await fetchProductRecommendations(id);
        console.log(recommend);

        if (recommend && recommend.suggestions) {
          // Chuyển đổi itemId thành _id cho từng sản phẩm
          const updatedRecommendations = recommend.suggestions.map(
            (product) => {
              // Tạo một bản sao của sản phẩm với itemId được thay bằng _id
              return {
                ...product,
                _id: product.itemId, // Gán giá trị itemId cho _id
                itemId: undefined, // Loại bỏ itemId (có thể không cần nếu bạn chỉ muốn giữ _id)
              };
            }
          );

          setProductRecommendation(updatedRecommendations);
        } else {
          throw new Error('Không tìm thấy sản phẩm đề xuất.'); // Ném lỗi nếu không tìm thấy sản phẩm
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchProductRecommendation();
    fetchProduct();
    // Gọi hàm fetchProduct
  }, [id]);

  useEffect(() => {
    if (descriptionRef.current) {
      const descriptionHeight = descriptionRef.current.scrollHeight;
      setShowToggleButton(descriptionHeight > 250);
    }
  }, [product]);

  useEffect(() => {
    const fetchProductReview = async () => {
      try {
        const response = await getProductReviews(id, currentReviewPage);

        if (response) {
          setReviews(response.reviews);
          setCurrentReviewPage(response.currentPage);
          setTotalReviewPages(response.totalPages);
          setTotalReviews(response.totalReviews);
        } else {
          throw new Error('Không tìm thấy đánh giá.'); // Ném lỗi nếu không tìm thấy sản phẩm
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchProductReview();
  }, [id, currentReviewPage]);

  const handleAddProductToCart = async () => {
    const result = await addToCart(
      id,
      selectedVariant._id,
      count,
      selectedVariant.volume,
      user.accessToken
    );
    if (result) {
      console.log('Sản phẩm đã được thêm vào giỏ hàng:', result);
      alert('Sản phẩm đã được thêm vào giỏ hàng!');
    } else {
      console.log('Đã có lỗi xảy ra xin hãy thử lại sau');
    }
  };

  if (!product) {
    return <div>Product not found</div>;
  }

  if (loading) return <p>Đang tải sản phẩm...</p>;

  const openModal = (image) => {
    setSelectedImage(image);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedImage(null);
  };

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  const textStyles = {
    Header: {
      normal: {
        size: 16,
        lineHeight: 22,
      },
      small: {
        size: 15,
        lineHeight: 20,
      },
    },
  };

  const handlePageChange = (page) => {
    setCurrentReviewPage(page);
  };

  return (
    <Page className="page flex flex-col h-screen">
      <Suspense>
        <div className="relative mb-24">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-0 left-0 z-50 px-3 py-3 radius-custom overflow-hidden active:bg-slate-300"
          >
            <Icon icon='zi-arrow-left' size={30} />
          </button>
          <div className="flex  flex-col  md:flex-row md:items-start relative ">
            <Swiper>
              {product.images.map((image, index) => (
                <Swiper.Slide key={index}>
                  <div className="flex justify-center h-[40vh] w-full">
                    <img
                      className="h-full w-full object-cover mb-4 md:mr-4 border-b border-gray-300"
                      src={image}
                      alt={`slide-${index + 1}`}
                      onClick={() => openModal(image)}
                    />
                  </div>
                </Swiper.Slide>
              ))}
            </Swiper>
            <div className="px-4 mt-2">
              <h1 className="text-3xl font-bold ">{product.name}</h1>

              <div className="my-4 flex space-x-2">
                {product.variants && product.variants.length > 0 ? ( // Kiểm tra xem có biến thể không
                  product.variants.map((variant) => (
                    <button
                      key={variant._id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`border-2 rounded-lg px-4 py-1 transition duration-300 ease-in-out ${selectedVariant && selectedVariant._id === variant._id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                        }`}
                    >
                      {variant.volume}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500">Loading.</p> // Thông báo nếu không có biến thể
                )}
              </div>

              <div className="flex align-middle items-center justify-between my-4">
                <div className="flex items-center border border-gray-500 p-1 px-3 rounded-lg">
                  <button
                    disabled={count <= 1 ? true : false}
                    onClick={() => setCount(count - 1)}
                  >
                    <FiMinus size={24} />
                  </button>
                  <span className="text-lg font-bold px-4">{count}</span>
                  <button onClick={() => setCount(count + 1)}>
                    <FiPlus size={24} />
                  </button>
                </div>
                <p className="font-extrabold text-2xl">
                  {selectedVariant
                    ? selectedVariant.price.toLocaleString()
                    : product.price.toLocaleString()}{' '}
                  <span className="font-bold text-lg">VNĐ</span>
                </p>
              </div>

              <div className="flex align-middle items-center justify-end my-4">
                <p className="text-lg">
                  Số lượng còn: {selectedVariant.stock}
                </p>
              </div>

              <p className="text-xl font-bold mt-4 bold-text">
                Thông tin sản phẩm
              </p>
              <div className="relative mt-2">
                <p
                  ref={descriptionRef}
                  className={`text-base transition-all duration-300 ${isExpanded ? 'max-h-none' : 'max-h-[250px] overflow-hidden'}`}
                >
                  {product.description}
                </p>

                {!isExpanded && showToggleButton && (
                  <div className="absolute bottom-6 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent z-1"></div>
                )}

                {showToggleButton && (
                  <div className="flex justify-center mt-2">
                    <button
                      onClick={toggleDescription}
                      className="text-gray-900 bg-white border border-gray-500 font-medium rounded-full text-sm px-5 py-1.5 relative"
                    >
                      {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                      {isExpanded ? (<Icon icon='zi-chevron-double-up' />) : (<Icon icon='zi-chevron-double-down' />)}
                    </button>
                  </div>
                )}
              </div>
              <h2 className="text-xl font-bold mt-4">Thành phần</h2>
              {product.ingredients && product.ingredients.length > 0 ? (
                <table className="min-w-full border-collapse border border-gray-300 mt-4">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left">Thành phần</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Tỉ lệ (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.ingredients.map((ingredient) => (
                      <tr key={ingredient._id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">{ingredient.name}</td>
                        <td className="border border-gray-300 px-4 py-2">{ingredient.percentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500 mt-4">Chưa có thông tin về thành phần.</p>
              )}

              <h2 className="text-xl font-bold mt-4">Lợi ích</h2>
              <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside">
                {product.benefits && product.benefits.length > 0 ? (
                  product.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center space-x-3 my-2 ml-2 rtl:space-x-reverse">
                      <svg class="flex-shrink-0 w-3.5 h-3.5 text-green-500 dark:text-green-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5.917 5.724 10.5 15 1.5" />
                      </svg>
                      <span>{benefit}</span>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500">Chưa có thông tin về lợi ích.</p>
                )}
              </ul>

              {/* <h2 className="text-xl font-bold mt-4">
                Đánh giá: {product.averageRating} sao
              </h2> */}
              <h2 className="text-xl font-bold mt-4 mb-2">Đánh Giá Sản Phẩm</h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <StarRating rating={product?.averageRating} />
                  <p className="text-red-500 ml-2">{product?.averageRating?.toFixed(1)}/5</p>
                </div>
                <span className="text-gray-500">
                  ({reviews.length} đánh giá)
                </span>
              </div>
              <div className="mt-4 border px-4 py-2 rounded-md">
                {/* Hiển thị review ở đây */}
                {reviews?.length > 0 ? (
                  reviews?.map((review) => (
                    <div
                      key={review._id}
                      className="border-b border-gray-300 pb-4 mb-4 flex flex-col gap-2"
                    >
                      <div className='flex'>
                        <img
                          key={review.userId}
                          src={review.userAvatar}
                          alt={review.userName}
                          className="h-8 w-8 object-cover mr-2 rounded-full"
                        />
                        <div className='flex flex-col'>
                          <p className="font-semibold">{review.userName}</p>
                          <p className="flex gap-2">
                            <StarRating rating={review.rating} />
                          </p>
                        </div>
                      </div>
                      <p className="flex gap-2">
                        <span>{review.comment}</span>
                      </p>
                      {review.images && review.images.length > 0 && (
                        <div className="flex flex-row gap-2 overflow-x-auto flex-nowrap">
                          {review?.images?.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Review image ${index}`}
                              className="h-20 w-20 object-cover mr-2"
                              onClick={() => openModal(image)}
                            />
                          ))}
                        </div>
                      )}
                      <p className="flex gap-2">
                        <span className='text-sm'>
                          {new Date(review.createdAt)
                            .getDate()
                            .toString()
                            .padStart(2, '0')}
                          /
                          {(new Date(review.createdAt).getMonth() + 1)
                            .toString()
                            .padStart(2, '0')}
                          /{new Date(review.createdAt).getFullYear()} -{' '}
                          {`${new Date(review.createdAt).getHours()}h${new Date(review.createdAt).getMinutes().toString().padStart(2, '0')}`}
                        </span>
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">
                    Chưa có đánh giá cho sản phẩm này.
                  </p>
                )}

                {reviews?.length > 0 && (
                  <Pagination
                    currentPage={currentReviewPage}
                    totalPages={totalReviewPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </div>

              <h2 className="text-xl font-bold mt-4">Sản phẩm tương tự</h2>
              <div className="mt-4 ">
                <ProductCard products={productRecommendation} />
              </div>
            </div>
          </div>

          <div className="fixed bottom-0 border border-t flex justify-between w-full px-4 bg-white py-4">
            <button
              onClick={handleAddProductToCart}
              className="w-1/4 rounded-xl border-2 border-gray-500 flex justify-center items-center bg-white active:bg-slate-300"
            >
              <MdOutlineAddShoppingCart size={24} />
            </button>
            <button
              onClick={handlePayment}
              className="flex items-center justify-center w-8/12 py-3 rounded-xl bg-blue-500 active:bg-blue-300"
            >
              <IoBagCheckOutline size={24} color="white" />
              <span className="ml-2 text-lg text-white font-bold">
                Thanh toán ngay
              </span>
            </button>
          </div>
        </div>
      </Suspense>

      {isOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-75"
          onClick={closeModal}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage}
              alt="Zoomed"
              className="max-w-full max-h-screen p-2"
            />
            <button
              onClick={closeModal}
              className="absolute top-0 right-0 p-4 text-white"
            >
              <Icon icon='zi-close'></Icon>
            </button>
          </div>
        </div>
      )}

    </Page>
  );
};

export default ProductDetail;
