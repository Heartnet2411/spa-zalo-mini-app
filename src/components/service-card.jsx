import React, { Suspense, useState, useRef } from 'react';
import { Button, Input, Box, Page, useSnackbar } from 'zmp-ui';
import { Link } from 'react-router-dom';

const ServiceCard = ({ services }) => {
  return (
    <div className="scroll-container grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {services && services.length > 0 ? (
        services.map((service) => (
          <Link
            to={`/service/${service.id}`}
            key={service.id}
            className="border rounded-lg py-4 px-4 bg-white shadow-md flex flex-col items-center justify-between"
          >
            {service.image ? (
              <img
                src={service.image}
                alt={service.name}
                className="w-40 h-32 object-cover mb-2 rounded"
              />
            ) : null}
            <h2 className="text-xl font-semibold mb-2 text-center">
              {service.itemName}
            </h2>

            {service.price ? (
              <p className="text-center mb-2 text-base">
                Giá: {service.price.toLocaleString()} VNĐ
              </p>
            ) : null}
            <p className="text-center  px-2 py-2 rounded-lg bg-gradient-to-r from-blue-300 to-blue-500 text-white font-semibold">
              Đặt lịch ngay
            </p>
          </Link>
        ))
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default ServiceCard;
