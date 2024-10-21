import React, { useState, useEffect } from 'react';
import { Page, Text, Input, Select, Icon } from 'zmp-ui';
import Header from '../components/header';
import { useRecoilValue } from 'recoil';
import { userState } from '../state';
import { getAllProduct } from '../services/product.service';
import { getAllServices } from '../services/service.service';
import { createBookingAPI } from '../services/booking.service';
import moment from 'moment';

const BookingFormPage = () => {
  const { userInfo: user, accessToken } = useRecoilValue(userState);

  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesData = await getAllServices(1);
        console.log('Fetched Services:', servicesData);
        setServices(servicesData.services || []);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    const fetchProducts = async () => {
      try {
        const productsData = await getAllProduct(1);
        console.log('Fetched Products:', productsData);
        setProducts(productsData.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchServices();
    fetchProducts();
  }, []);

  const handleServiceSelect = (value) => {
    if (!selectedServices.includes(value)) {
      setSelectedServices([...selectedServices, value]);
      console.log('Selected Services:', [...selectedServices, value]); // Hiển thị danh sách dịch vụ đã chọn
    }
  };

  const handleProductSelect = (value) => {
    const selectedProduct = products.find((product) => product._id === value);
    if (
      selectedProduct &&
      !selectedProducts.some(
        (product) => product.productId === selectedProduct._id
      )
    ) {
      const variantId = selectedProduct.variants[0]?._id; // Lấy variantId đầu tiên
      setSelectedProducts([
        ...selectedProducts,
        { productId: selectedProduct._id, variantId, quantity: 1 },
      ]);
      setSelectedVariants({
        ...selectedVariants,
        [selectedProduct._id]: variantId,
      }); // Lưu variant đã chọn
      console.log('Selected Products:', [
        ...selectedProducts,
        { productId: selectedProduct._id, variantId, quantity: 1 },
      ]);
    }
  };

  const handleVariantSelect = (productId, variantId) => {
    setSelectedVariants({ ...selectedVariants, [productId]: variantId });
  };

  const removeSelectedService = (serviceId) => {
    setSelectedServices(selectedServices.filter((id) => id !== serviceId));
  };

  const removeSelectedProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter((id) => id !== productId));
  };

  const renderSelectedProducts = () =>
    selectedProducts.map(({ productId }) => {
      const product = products.find((p) => p._id === productId);
      return (
        <div key={productId} className="flex items-center">
          <div className="bg-gray-200 p-3 rounded">
            <span>{product.name}</span>
            <Select
              value={selectedVariants[productId]}
              onChange={(value) => handleVariantSelect(productId, value)}
            >
              {product.variants.map((variant) => (
                <Select.Option key={variant._id} value={variant._id}>
                  {variant.volume} - {variant.price}đ
                </Select.Option>
              ))}
            </Select>
          </div>
          <button
            className="ml-2 text-blue-500"
            onClick={() => removeSelectedProduct(productId)}
          >
            <Icon icon="zi-edit-delete-solid" className="text-orange-500" />
          </button>
        </div>
      );
    });

  const handleSubmit = async () => {
    const formattedDateTime = moment(
      `${bookingDate} ${bookingTime}`,
      'YYYY-MM-DD HH:mm'
    ).format('DD/MM/YYYY HH:mm');

    const bookingData = {
      date: formattedDateTime,
      services: selectedServices,
      products: selectedProducts.map(({ productId }) => ({
        productId,
        variantId: selectedVariants[productId] || null,
        quantity: 1,
      })),
    };

    try {
      const result = await createBookingAPI(bookingData, accessToken);
      if (result) {
        console.log('Booking created successfully:', result);
      } else {
        console.error('Failed to create booking');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  return (
    <Page className="page">
      <Header />
      <div className="p-4 mt-14 mb-14">
        <div className="bg-white p-4 rounded-lg border border-gray-500 shadow-md">
          <h1 className="text-2xl mb-4 text-center custom-font">THÔNG TIN ĐẶT HẸN</h1>
          
          <Text className="mt-4">Khách hàng</Text>
          <Input id="name" type="text" value={user.name} readOnly />

          <Text className="mt-4">Ngày đặt lịch</Text>
          <Input
            id="booking-date"
            type="date"
            onChange={(e) => setBookingDate(e.target.value)}
          />

          <Text className="mt-4">Giờ đặt lịch</Text>
          <Input
            id="booking-time"
            type="time"
            onChange={(e) => setBookingTime(e.target.value)}
          />

          <Text className="mt-4">Dịch vụ</Text>
          <div>
            <Select placeholder="Chọn dịch vụ" onChange={handleServiceSelect}>
              {services.map((service) => (
                <Select.Option key={service._id} value={service._id}>
                  <div className="flex items-center">
                    <span>{service.name}</span>
                  </div>
                </Select.Option>
              ))}
            </Select>
            {selectedServices.map((serviceId) => (
              <div key={serviceId} className="flex items-center">
                <div className="bg-gray-200 p-3 rounded">
                  <span>
                    {
                      services.find((service) => service._id === serviceId)
                        ?.name
                    }
                  </span>
                </div>
                <button
                  className="ml-2 text-blue-500"
                  onClick={() => removeSelectedService(serviceId)}
                >
                  <Icon
                    icon="zi-edit-delete-solid"
                    className="text-orange-500"
                  />
                </button>
              </div>
            ))}
          </div>

          <Text className="mt-4">Sản phẩm</Text>
          <div>
            <Select placeholder="Chọn sản phẩm" onChange={handleProductSelect}>
              {products.map((product) => (
                <Select.Option key={product._id} value={product._id}>
                  <div className="flex items-center">
                    <span>{product.name}</span>
                  </div>
                </Select.Option>
              ))}
            </Select>
            {renderSelectedProducts()}
          </div>
        </div>

        <button
          className="mt-5 h-8 w-full rounded-full flex items-center justify-center bg-red-500"
          onClick={handleSubmit}
        >
          <span className="ml-2 text-base text-white">Đặt lịch</span>
        </button>
      </div>
    </Page>
  );
};

export default BookingFormPage;
