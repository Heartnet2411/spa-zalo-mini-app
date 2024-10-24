import React, { Suspense, useState, useRef } from 'react';
import { Button, Input, Box, Page, useSnackbar, Icon } from 'zmp-ui';
import { Link } from 'react-router-dom';

const ProductCard = ({ products }) => {
  return (
    <div className="scroll-container grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-1 w-full">
      {products && products.length > 0 ? (
        products.map((product) => (
          <Link
            to={`/product/${product._id}`}
            key={product._id}
            className="border p-4 bg-white flex flex-col gap-4"
          >
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-40 h-32 object-contain mb-2 rounded"
              />
            ) : null}

            <h2 className="font-medium">
              {product.name ? product.name : product.itemName}
            </h2>
            <div className="w-full flex justify-center items-center">
              <p className="text-[18px] rounded-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-blue-500 font-semibold">
                {product.price
                  ? product.price.toLocaleString() + ' đ'
                  : 'Mua hàng ngay'}{' '}
              </p>
            </div>
            <div className="w-full flex items-center justify-between text-sm">
              Đã bán {product?.salesQuantity}
              <div className="flex items-start justify-center gap-1 text-sm">
                <Icon icon="zi-star" size={18} />5
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
