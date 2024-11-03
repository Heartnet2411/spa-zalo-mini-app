import React, { useEffect, useState } from 'react';
import { Page, Swiper, Box, Text } from 'zmp-ui';
import Header from '../components/header';
import Category from '../components/category';
import { products } from '../utils/productdemo';
import { services } from '../utils/servicedemo';
import HomeProductCard from '../components/home-product_card';
import HomeServiceCard from '../components/home-service-card';
import ServiceCard from '../components/service-card';
import ServiceChoose from '../components/service-choose';
import {
  getCombinedProductRecommendations,
  getCombinedServiceRecommendations,
  getSuggestedProductsForUser,
  getSuggestedServicesForUser,
} from '../services/recommendersystem.service';
import { getFiveProducts } from '../services/product.service';
import { getFiveServices } from '../services/service.service';
import { fetchSliderConfigs } from '../services/app.service';
import { userState } from '../state';
import { useRecoilState } from 'recoil';

export default function HomePage() {
  const [user, setUserState] = useRecoilState(userState);
  console.log(user);

  const [productSuggestions, setProductSuggestions] = useState([]);
  const [serviceSuggestions, setServiceSuggestions] = useState([]);

  const [productRecommendations, setProductRecommendations] = useState([]);
  const [serviceRecommendations, setServiceRecommendations] = useState([]);
  const [sliderConfigs, setSliderConfigs] = useState([]);

  useEffect(() => {
    const getSlider = async () => {
      const configs = await fetchSliderConfigs();
      console.log(configs); // Kiểm tra cấu trúc dữ liệu trả về
      if (configs && Array.isArray(configs.images)) {
        setSliderConfigs(configs.images); // Lưu trữ mảng images từ API
      }
    };

    getSlider();
  }, []);

  const getProductAndService = async () => {
    try {
      // Gọi API để lấy gợi ý sản phẩm
      const productResponse = await getFiveProducts();
      console.log(productResponse);
      if (productResponse) {
        setProductRecommendations(productResponse.products);
      }

      // Gọi API để lấy gợi ý dịch vụ
      const serviceResponse = await getFiveServices();
      console.log(serviceResponse);
      if (serviceResponse) {
        setServiceRecommendations(serviceResponse.services);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRecommendations = async () => {
    try {
      // Gọi API để lấy gợi ý sản phẩm
      const productResponse = await getCombinedProductRecommendations(
        '',
        user.userInfo.id
      );
      console.log(productResponse);
      if (productResponse) {
        setProductRecommendations(
          productResponse.suggestions.flatMap(
            (suggestion) => suggestion.products
          )
        );
      }

      // Gọi API để lấy gợi ý dịch vụ
      const serviceResponse = await getCombinedServiceRecommendations(
        '',
        user.userInfo.id
      );
      console.log(serviceResponse);
      if (serviceResponse) {
        setServiceRecommendations(
          serviceResponse.suggestions.flatMap(
            (suggestion) => suggestion.services
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  console.log('prodyc', productRecommendations);

  const getSuggestions = async () => {
    try {
      const productResponse = await getSuggestedProductsForUser(
        user.userInfo.id
      );

      if (productResponse) {
        setProductSuggestions(productResponse.data);
      }

      // Gọi API để lấy gợi ý dịch vụ
      const serviceResponse = await getSuggestedServicesForUser(
        user.userInfo.id
      );

      if (serviceResponse) {
        setServiceSuggestions(serviceResponse.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // Kiểm tra xem user có thông tin gì hay không
    if (
      !user.accessToken &&
      !user.refreshToken &&
      Object.keys(user.userInfo).length === 0
    ) {
      getProductAndService();
    } else {
      fetchRecommendations();
      getSuggestions();
    }
  }, [user]);

  return (
    <Page className="page">
      <Header />
      <div className="p-4 mb-14">
        <div className="mt-12 flex flex-col items-center justify-center">
          <Swiper autoplay duration={5000} loop>
            {sliderConfigs.length > 0
              ? sliderConfigs.map((image) => (
                  <Swiper.Slide key={image._id}>
                    {' '}
                    {/* Sử dụng _id làm key */}
                    <img
                      className="slide-img rounded-xl w-full h-full object-cover"
                      src={image.url} // Lấy URL từ trường url
                      alt={`slide-${image.index}`} // Tạo alt cho ảnh dựa trên index
                    />
                  </Swiper.Slide>
                ))
              : null}
          </Swiper>
        </div>

        <div className="my-4">
          <span className="text-xl font-semibold ">Khám phá sản phẩm</span>
        </div>
        <Category />
        {productSuggestions.length > 0 ? (
          <div className="my-4">
            <span className="text-xl font-semibold ">Sản phẩm dành cho bạn</span>
            <HomeProductCard products={productSuggestions} />
          </div>
        ) : (
          <div></div>
        )}

        {productRecommendations.length > 0 ? (
          <div className="my-4">
            <span className="text-xl font-semibold ">
              Sản phẩm khuyến nghị
            </span>
            <HomeProductCard products={productRecommendations} />
          </div>
        ) : (
          <div></div>
        )}

        {serviceSuggestions.length > 0 ? (
          <div className="my-4">
            <span className="text-xl font-semibold ">Dịch vụ dành cho bạn</span>
            <HomeServiceCard services={serviceSuggestions} />
          </div>
        ) : (
          <div></div>
        )}

        {serviceRecommendations.length > 0 ? (
          <div className="my-4">
            <span className="text-xl font-semibold ">Dịch vụ khuyến nghị</span>
            <HomeServiceCard services={serviceRecommendations} />
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </Page>
  );
}
