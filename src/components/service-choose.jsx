import React, { useState, useEffect } from 'react';
import { Button, Page } from 'zmp-ui';
import { getAllCategory } from '../services/service.service';

const ServiceChoose = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      const data = await getAllServices();
      if (data) {
        setServices(data);
      }
    };

    fetchServices();
  }, []);

  // Tự động mở modal khi vào trang
  useEffect(() => {
    setShowModal(true);
  }, []);

  // Hàm để chọn hoặc bỏ chọn dịch vụ
  const toggleService = (service) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter((item) => item !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <Page className="page  max-h-screen">
      {/* Modal tùy chỉnh */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 flex flex-col justify-center">
            <h2 className="text-lg font-bold mb-4 text-center">
              Bạn đang quan tâm đến dịch vụ nào của chúng tôi?
            </h2>

            {/* Danh sách dịch vụ dưới dạng tag */}
            <div className="flex flex-wrap gap-2 justify-center ">
              {services.map((service) => (
                <button
                  key={service._id}
                  onClick={() => toggleService(service)}
                  className={`px-4 py-2 rounded-full border ${
                    selectedServices.includes(service)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {service.name}
                </button>
              ))}
            </div>

            {/* Nút đóng modal */}
            <button
              onClick={closeModal}
              className="mt-6 w-4/5 bg-blue-500 py-2 rounded-2xl text-center mx-auto font-semibold"
            >
              Xác nhận ({selectedServices.length} dịch vụ đã chọn)
            </button>
          </div>
        </div>
      )}
    </Page>
  );
};

export default ServiceChoose;
