import React, { Suspense, useState, useRef } from 'react';
import { Button, Input, Box, Page, useSnackbar } from 'zmp-ui';
import { Link } from 'react-router-dom';

const HomeServiceCard = ({ services }) => {
  // Kiểm tra services có phải là mảng không
  if (!Array.isArray(services)) {
    return <p>Không có dịch vụ nào để hiển thị.</p>; // Hiển thị thông báo nếu không có dịch vụ
  }

  return (
    <div className="scroll-container flex overflow-x-auto gap-4 p-4">
      {services.map((service) => (
        <Link
          to={`/service/${service._id}`}
          key={service._id}
          className="border rounded-lg py-4 px-4 bg-white shadow-md flex flex-col items-center justify-between shrink-0"
        >
          <img
            src={
              service.images && service.images.length > 0
                ? service.images[0]
                : service.image
            }
            alt={service.name}
            className="w-48 h-32 object-cover mb-2 rounded"
          />
          <h2 className="text-xl font-semibold mb-2 text-center  w-52 whitespace-normal overflow-wrap line-clamp-2">
            {service.name}
          </h2>

          <p className="text-center mb-2 text-base">
            Giá: {service.price.toLocaleString()} VNĐ
          </p>
          <p className="text-center px-2 py-2 rounded-lg bg-gradient-to-r from-blue-300 to-blue-500 text-white font-semibold">
            Đặt lịch ngay
          </p>
        </Link>
      ))}
    </div>
  );
};

export default HomeServiceCard;
