import React, { Suspense, useState, useRef } from 'react';
import { Button, Input, Box, Page, useSnackbar } from 'zmp-ui';
import { Link } from 'react-router-dom';

const ProductCard = ({ products }) => {
  return (
    <div className="scroll-container grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products && products.length > 0 ? (
        products.map((product) => (
          <Link
            to={`/product/${product._id}`}
            key={product._id}
            className="border rounded-lg p-4 bg-white shadow-md flex flex-col items-center justify-between"
          >
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-40 h-32 object-contain mb-2 rounded"
              />
            ) : null}

            <h2 className="text-xl font-semibold mb-2 text-center">
              {product.name ? product.name : product.itemName}
            </h2>
            <p className="text-center  px-2 py-2 rounded-lg bg-gradient-to-r from-blue-300 to-blue-500 text-white font-semibold">
              {product.price
                ? 'Giá: ' + product.price.toLocaleString() + ' VND'
                : 'Mua hàng ngay'}{' '}
            </p>
          </Link>
        ))
      ) : (
        <div>Đang tải sản phẩm</div>
      )}
    </div>
  );
};

export default ProductCard;
