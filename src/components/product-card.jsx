import React, { Suspense, useState, useRef } from 'react';
import { Button, Input, Box, Page, useSnackbar, Icon } from 'zmp-ui';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

const ProductCard = ({ products }) => {
  return (
    <div className=" grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full ">
      {products && products.length > 0 ? (
        products.map((product) => (
          <Link
            to={`/product/${product._id ? product._id : product.itemId}`}
            key={product._id ? product._id : product.itemId}
            className="border p-4 bg-white flex flex-col gap-4 rounded-xl"
          >
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-40 h-32 object-cover mb-2 rounded-xl"
              />
            ) : (
              <div className="h-28 w-32 bg-gray-200"></div>
            )}

            <h2
              className="font-medium overflow-hidden text-ellipsis"
              style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                minHeight: '3em',
              }}
            >
              {product.name ? product.name : product.itemName}
            </h2>

            <div className="w-full flex justify-center items-center bg-gradient-to-r rounded-lg  from-blue-300 to-blue-500">
              <p className="text-lg py-1 text-white font-semibold">
                {product.price ? (
                  product.price.toLocaleString() + ' đ'
                ) : (
                  <span className="text-base">Mua hàng ngay</span>
                )}
              </p>
            </div>
            <div className="w-full flex items-center justify-between text-sm">
              Đã bán {product?.salesQuantity}
              <div className="flex items-center justify-center gap-1 text-yellow-300 ">
                <FaStar size={16} className="" />
                <span className="text-black">{product.averageRating}</span>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default ProductCard;
