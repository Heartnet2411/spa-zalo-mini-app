// src/pages/ProductDetail.js
import React, { Suspense, useState, useRef, useEffect } from 'react';
import { Button, Input, Text, Page, useSnackbar } from 'zmp-ui';
import { useParams } from 'react-router-dom';
import { products } from '../utils/productdemo';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { MdOutlineAddShoppingCart } from 'react-icons/md';
import { IoBagCheckOutline } from 'react-icons/io5';
import { getProductById } from '../services/product.service';
import { addToCart } from '../services/cart.service';
import { useRecoilState } from 'recoil';
import { userState } from '../state';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const [user, setUserState] = useRecoilState(userState);

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

    fetchProduct();
    // Gọi hàm fetchProduct
  }, [id]);

  const handleAddProductToCart = async () => {
    const result = await addToCart(id, count, user.accessToken);
    if (result) {
      console.log('Sản phẩm đã được thêm vào giỏ hàng:', result);
      alert('Sản phẩm đã được thêm vào giỏ hàng!');
    } else {
      console.log('Không thể thêm sản phẩm vào giỏ hàng.');
    }
  };

  if (!product) {
    return <div>Product not found</div>;
  }

  if (loading) return <p>Đang tải sản phẩm...</p>;

  return (
    <Page className="page flex flex-col h-screen">
      <Suspense>
        <div className="  relative mb-24">
          <div className="flex  flex-col  md:flex-row md:items-start relative ">
            <img
              src={product.images}
              alt={product.name}
              className="h-[40vh] w-auto object-contain mb-4 md:mr-4 border-b border-gray-300"
            />
            <div className="px-8">
              <h1 className="text-3xl font-bold ">{product.name}</h1>

              <div className="my-4 flex space-x-2">
                {product.variants && product.variants.length > 0 ? ( // Kiểm tra xem có biến thể không
                  product.variants.map((variant) => (
                    <button
                      key={variant._id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`border-2 rounded-lg px-4 py-1 transition duration-300 ease-in-out ${
                        selectedVariant && selectedVariant._id === variant._id
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

              <Text size="xLarge M" bold>
                Thông tin sản phẩm
              </Text>
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
            </div>
          </div>

          <div className="fixed bottom-0 flex justify-between w-full px-4 bg-white py-4">
            <button
              onClick={handleAddProductToCart}
              className="w-1/4 rounded-xl border-2 border-gray-500 flex justify-center items-center bg-white"
            >
              <MdOutlineAddShoppingCart size={24} />
            </button>
            <button className="flex items-center justify-center w-8/12 py-3 rounded-xl bg-blue-500">
              <IoBagCheckOutline size={24} />
              <span className="ml-2 text-base font-bold">Thanh toán ngay</span>
            </button>
          </div>
        </div>
      </Suspense>
    </Page>
  );
};

export default ProductDetail;
