import React from 'react';
import { Link } from 'react-router-dom';

const HomeProductCard = ({ products }) => {
  return (
    <div className="scroll-container overflow-x-auto whitespace-nowrap">
      <div className="flex gap-4">
        {products ? (
          products.map((product) => (
            <Link
              to={`/product/${product._id}`}
              key={product._id}
              className="border rounded-lg p-4 bg-white shadow-md flex flex-col items-center justify-between"
            >
              <img
                src={
                  product.images && product.images.length > 0
                    ? product.images[0]
                    : product.image
                }
                alt={product.name}
                className="w-40 h-32 object-contain mb-2 rounded"
              />
              <h2 className="text-xl font-semibold mb-2 text-center">
                {product.name}
              </h2>
              <p className="text-center px-2 py-2 rounded-lg bg-gradient-to-r from-blue-300 to-blue-500 text-white font-semibold">
                Giá: {product.price.toLocaleString()} VNĐ
              </p>
            </Link>
          ))
        ) : (
          <div>Đang tải sản phẩm</div>
        )}
      </div>
    </div>
  );
};

export default HomeProductCard;