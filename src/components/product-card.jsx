import React, { Suspense, useState, useRef } from 'react';
import { Button, Input, Box, Page, useSnackbar } from 'zmp-ui';
import { Link } from 'react-router-dom';

const ProductCard = ({ productList }) => {
  return (
    <div className="scroll-container grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {productList.map((product) => (
        <Link
          to={`/product/${product.id}`}
          key={product.id}
          className="border rounded-lg p-4 bg-white shadow-md flex flex-col items-center justify-between"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-40 h-32 object-contain mb-2 rounded"
          />
          <h2 className="text-xl font-semibold mb-2 text-center">
            {product.name}
          </h2>
          <p className="text-center  px-2 py-2 rounded-lg bg-gradient-to-r from-blue-300 to-blue-500 text-white font-semibold">
            Giá: {product.price.toLocaleString()} VNĐ
          </p>
        </Link>
      ))}
    </div>
  );
};

export default ProductCard;
