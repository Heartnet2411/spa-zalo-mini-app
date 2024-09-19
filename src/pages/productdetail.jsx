// src/pages/ProductDetail.js
import React, { Suspense, useState, useRef } from 'react';
import { Button, Input, Box, Page, useSnackbar } from 'zmp-ui';
import { useParams } from 'react-router-dom';
import { products } from '../utils/productdemo';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { MdOutlineAddShoppingCart } from 'react-icons/md';
import { IoBagCheckOutline } from 'react-icons/io5';

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find((product) => product.id === parseInt(id));
  const [count, setCount] = useState(0);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <Page className="page flex flex-col h-screen">
      <Suspense>
        <div className="p-4 flex-grow overflow-y-auto scroll-container ">
          <div className="flex flex-col items-center md:flex-row md:items-start relative ">
            <img
              src={product.image}
              alt={product.name}
              className=" h-2/5 object-contain mb-4 md:mr-4"
            />
            <div className="px-4">
              <h1 className="text-3xl font-bold ">{product.name}</h1>
              <p className="text-gray-500 mt-1 text-base">150 ml</p>
              <div className="flex align-middle items-center justify-between my-6">
                <div className="flex items-center border border-gray-500 p-1 px-3 rounded-lg">
                  <button
                    disabled={count <= 0 ? true : false}
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
                  {product.price.toLocaleString()}{' '}
                  <span className="font-bold text-lg">VNĐ</span>
                </p>
              </div>

              <p className="text-xl font-bold">Thông tin sản phẩm</p>
              <p className="text-base">{product.description}</p>
            </div>
            <div className="sticky bottom-0 flex justify-between w-full px-4 bg-white py-4">
              <button className="w-1/4 rounded-xl border-2 border-gray-500 flex justify-center items-center bg-white">
                <MdOutlineAddShoppingCart size={24} />
              </button>
              <button className="flex items-center justify-center w-8/12 py-3 rounded-xl bg-blue-500">
                <IoBagCheckOutline size={24} />
                <span className="ml-2 text-base font-semibold">
                  Thanh toán ngay
                </span>
              </button>
            </div>
          </div>
        </div>
      </Suspense>
    </Page>
  );
};

export default ProductDetail;
