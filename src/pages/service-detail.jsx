// src/pages/serviceDetail.js
import React, { Suspense, useState, useRef, useEffect } from 'react';
import { Page, Swiper, Box, Text, Button, Icon } from 'zmp-ui';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { products } from '../utils/productdemo';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { MdOutlineAddShoppingCart } from 'react-icons/md';
import { IoBagCheckOutline } from 'react-icons/io5';
import { IoReturnDownBack } from 'react-icons/io5';
import { getServiceById } from '../services/service.service';
import { addToCart } from '../services/cart.service';
import { fetchServiceRecommendations } from '../services/service.service';
import ServiceCard from '../components/service-card';
import { useRecoilState } from 'recoil';
import { userState } from '../state';

const ServiceDetail = () => {
  const { id } = useParams();
  console.log(id);
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [serviceRecommendation, setServiceRecommendation] = useState(null);
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const [user, setUserState] = useRecoilState(userState);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const fetchedService = await getServiceById(id); // Gọi hàm để lấy sản phẩm
        if (fetchedService) {
          setService(fetchedService);
          console.log(fetchService);
          setSelectedVariant(fetchedService.variants[0]);
        } else {
          throw new Error('Không tìm thấy sản phẩm.'); // Ném lỗi nếu không tìm thấy sản phẩm
        }
      } catch (err) {
        console.error(err);
        // Cập nhật state với thông điệp lỗi
      } finally {
        setLoading(false); // Cập nhật trạng thái loading
      }
    };

    const fetchServiceRecommendation = async () => {
      try {
        const recommend = await fetchServiceRecommendations(id);
        console.log(recommend);

        if (recommend && recommend.suggestions) {
          // Chuyển đổi itemId thành _id cho từng sản phẩm
          const updatedRecommendations = recommend.suggestions.map(
            (service) => {
              // Tạo một bản sao của sản phẩm với itemId được thay bằng _id
              return {
                ...service,
                _id: service.itemId, // Gán giá trị itemId cho _id
                itemId: undefined, // Loại bỏ itemId (có thể không cần nếu bạn chỉ muốn giữ _id)
              };
            }
          );

          setServiceRecommendation(updatedRecommendations);
        } else {
          throw new Error('Không tìm thấy sản phẩm đề xuất.'); // Ném lỗi nếu không tìm thấy sản phẩm
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchServiceRecommendation();
    fetchService();
    // Gọi hàm fetchservice
  }, [id]);

  if (!service) {
    return <div>service not found</div>;
  }

  if (loading) return <p>Đang tải sản phẩm...</p>;

  return (
    <Page className="page flex flex-col h-screen">
      <Suspense>
        <div className="relative mb-24">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-0 left-0 z-50 px-3 py-3 radius-custom overflow-hidden active:bg-slate-300"
          >
            <Icon icon='zi-arrow-left' size={30} />
          </button>
          <div className="flex  flex-col  md:flex-row md:items-start relative ">
            <Swiper>
              {service.images.map((image, index) => (
                <Swiper.Slide key={index}>
                  <div className="flex justify-center h-[40vh] w-full">
                    <img
                      className="h-full w-full object-cover mb-4 md:mr-4 border-b border-gray-300"
                      src={image}
                      alt={`slide-${index + 1}`}
                    />
                  </div>
                </Swiper.Slide>
              ))}
            </Swiper>
            <div className="px-8 mt-2">
              <h1 className="text-3xl font-bold ">{service.name}</h1>

              <div className="flex align-middle items-center justify-between my-4">
                <p className="font-extrabold text-2xl">
                  <span className="font-bold text-lg">{service.price} VNĐ</span>
                </p>
              </div>

              <p className="text-xl font-bold mt-4 bold-text">
                Thông tin dịch vụ
              </p>
              <p className="text-base">{service.description}</p>

              <h2 className="text-xl font-bold mt-4">Dịch vụ tương tự</h2>
              <div className="mt-4 ">
                <ServiceCard services={serviceRecommendation} />
              </div>
            </div>
          </div>

          <div className="fixed border border-t bottom-0 flex justify-center w-full px-4 bg-white py-4">
            <button className="flex items-center justify-center w-8/12 py-2 rounded-xl bg-blue-500 active:bg-blue-300">
              <span className="ml-2 text-lg text-white font-bold">
                Đặt lịch ngay
              </span>
            </button>
          </div>
        </div>
      </Suspense>
    </Page>
  );
};

export default ServiceDetail;
