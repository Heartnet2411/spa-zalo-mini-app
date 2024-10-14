import React from 'react';
import { Page, Swiper, Box, Text } from 'zmp-ui';
import Header from '../components/header';
import Category from '../components/category';
import { products } from '../utils/productdemo';
import { services } from '../utils/servicedemo';
import ProductCard from '../components/product-card';
import ServiceCard from '../components/service-card';
import ServiceChoose from '../components/service-choose';
export default function HomePage() {
  return (
      <Page className="page">
        <Header />
        <div className="p-4 mb-14">
          <div className="mt-12 flex flex-col items-center justify-center">
            <Swiper autoplay duration={5000} loop>
              <Swiper.Slide>
                <img
                  className="slide-img"
                  src="https://stc-zmp.zadn.vn/zmp-zaui/images/0e05d63a7a93a6cdff826.jpg"
                  alt="slide-1"
                />
              </Swiper.Slide>
              <Swiper.Slide>
                <img
                  className="slide-img"
                  src="https://stc-zmp.zadn.vn/zmp-zaui/images/0f7c061caab576eb2fa45.jpg"
                  alt="slide-2"
                />
              </Swiper.Slide>
              <Swiper.Slide>
                <img
                  className="slide-img"
                  src="https://stc-zmp.zadn.vn/zmp-zaui/images/321fb45f18f6c4a89de78.jpg"
                  alt="slide-3"
                />
              </Swiper.Slide>
              <Swiper.Slide>
                <img
                  className="slide-img"
                  src="https://stc-zmp.zadn.vn/zmp-zaui/images/4f417921d58809d650997.jpg"
                  alt="slide-4"
                />
              </Swiper.Slide>
              <Swiper.Slide>
                <img
                  className="slide-img"
                  src="https://stc-zmp.zadn.vn/zmp-zaui/images/677fad2e0187ddd984969.jpg"
                  alt="slide-5"
                />
              </Swiper.Slide>
            </Swiper>
          </div>

          <div className="my-4">
            <span className="text-xl font-semibold ">Khám phá sản phẩm</span>
          </div>
          <Category />

          <div className="my-4">
            <span className="text-xl font-semibold ">
              Sản phẩm dành cho bạn
            </span>
          </div>
          <ProductCard productList={products} />

          <div className="my-4">
            <span className="text-xl font-semibold ">Dịch vụ dành cho bạn</span>
          </div>
          <ServiceCard services={services} />
        </div>
        <ServiceChoose />
      </Page>
  );
}
