// src/pages/ProductDetail.js
import React, { Suspense, useState, useRef, useEffect } from 'react';
import { Page, Swiper, Box, Text, Button } from 'zmp-ui';
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

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [productRecommendation, setProductRecommendation] = useState(null);
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const [reviews, setReviews] = useState([])
  const [currentReviewPage, setCurrentReviewPage] = useState(1)
  const [totalReviewPages, setTotalReviewPages] = useState(1)
  const [totalReviews, setTotalReviews] = useState(1)

  console.log(selectedVariant);
  console.log(count);

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
        setError(err.message); // Cập nhật state với thông điệp lỗi
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
    const fetchProductReview = async () => {
      try {
        const response = await getProductReviews(id, currentReviewPage);

        if (response) {
          setReviews(response.reviews)
          setCurrentReviewPage(response.currentPage)
          setTotalReviewPages(response.totalPages)
          setTotalReviews(response.totalReviews)
        } else {
          throw new Error('Không tìm thấy đánh giá.'); // Ném lỗi nếu không tìm thấy sản phẩm
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchProductReview();
  }, [id, currentReviewPage])

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

  return (
    <Page className="page flex flex-col h-screen">
      <Suspense>
        <div className="relative mb-24">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-0 left-0 bg-white z-50 px-4 py-1 radius-custom overflow-hidden active:bg-slate-300"
          >
            <IoReturnDownBack size={30} />
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
                    />
                  </div>
                </Swiper.Slide>
              ))}
            </Swiper>
            <div className="px-8 mt-2">
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

              <p className="text-xl font-bold mt-4 bold-text">
                Thông tin sản phẩm
              </p>
              <p className="text-base">{product.description}</p>

              <h2 className="text-xl font-bold mt-4">Thành phần</h2>
              <ul className="list-none ">
                {product.ingredients && product.ingredients.length > 0 ? (
                  product.ingredients.map((ingredient) => (
                    <li key={ingredient._id}>
                      {ingredient.name} - {ingredient.percentage}%
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500">
                    Chưa có thông tin về thành phần.
                  </p>
                )}
              </ul>

              <h2 className="text-xl font-bold mt-4">Lợi ích</h2>
              <ul className="list-none ">
                {product.benefits && product.benefits.length > 0 ? (
                  product.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))
                ) : (
                  <p className="text-gray-500">Chưa có thông tin về lợi ích.</p>
                )}
              </ul>

              <h2 className="text-xl font-bold mt-4">Đánh giá: {product.averageRating} sao</h2>
              <div className="mt-4 ">
                {/* Hiển thị review ở đây */}
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review._id} className="border-b border-gray-300 pb-4 mb-4">
                      <p className="font-bold">{review.productName}</p>
                      <p>{review.comment}</p>
                      <p className="text-sm text-gray-500">Đánh giá: {review.rating} sao</p>
                      {review.images && review.images.length > 0 && (
                        <div className="mt-2">
                          {review.images.map((image, index) => (
                            <img key={index} src={image} alt={`Review image ${index}`} className="h-20 w-20 object-cover mr-2" />
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Chưa có đánh giá cho sản phẩm này.</p>
                )}
              </div>

              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => {
                    if (currentReviewPage > 1) {
                      setCurrentReviewPage(currentReviewPage - 1);
                    }
                  }}
                  disabled={currentReviewPage === 1}
                  className={`px-4 py-2 border rounded ${currentReviewPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
                >
                  Trước
                </button>
                <span>
                  Trang {currentReviewPage} / {totalReviewPages}
                </span>
                <button
                  onClick={() => {
                    if (currentReviewPage < totalReviewPages) {
                      setCurrentReviewPage(currentReviewPage + 1);
                    }
                  }}
                  disabled={currentReviewPage === totalReviewPages}
                  className={`px-4 py-2 border rounded ${currentReviewPage === totalReviewPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
                >
                  Sau
                </button>
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
    </Page>
  );
};

export default ProductDetail;
