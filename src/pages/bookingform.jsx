import React, { useState, useEffect } from 'react';
import {
  Page,
  Text,
  Input,
  Select,
  Icon,
  Sheet,
  Button,
  Box,
  Grid,
  Modal,
  Radio,
  Stack,
  useNavigate,
  useSnackbar,
} from 'zmp-ui';
import Header from '../components/header';
import { useRecoilValue } from 'recoil';
import { userState } from '../state';
import { getAllProduct } from '../services/product.service';
import { getAllServices } from '../services/service.service';
import { createBookingAPI } from '../services/booking.service';
import moment from 'moment';
import ProductCard from '../components/product-card';

const BookingFormPage = () => {
  const { userInfo: user, accessToken } = useRecoilValue(userState);
  const { openSnackbar, closeSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');

  const [currentProductPage, setCurrentProductPage] = useState(1);
  const [productTotalPages, setProductTotalPages] = useState(0);
  const [productKeyword, setProductKeyword] = useState('');
  const [currentServicePage, setCurrentServicePage] = useState(1);
  const [serviceTotalPages, setServiceTotalPages] = useState(0);
  const [serviceKeyword, setServiceKeyword] = useState('');

  const [showProductSheet, setShowProductSheet] = useState(false);
  const [showServiceSheet, setShowServiceSheet] = useState(false);

  const openProductSheet = () => setShowProductSheet(true);
  const closeProductSheet = () => setShowProductSheet(false);
  const openServiceSheet = () => setShowServiceSheet(true);
  const closeServiceSheet = () => setShowServiceSheet(false);

  const [popupVisible, setPopupVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesData = await getAllServices(
          currentServicePage,
          serviceKeyword
        );
        console.log('Fetched Services:', servicesData);
        setServices(servicesData.services || []);
        setServiceTotalPages(servicesData.totalPages);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, [serviceKeyword]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getAllProduct(
          currentProductPage,
          '',
          productKeyword
        );
        console.log('Fetched Products:', productsData);
        setProducts(productsData.products || []);
        setProductTotalPages(productsData.totalPages);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [productKeyword]);

  const loadMoreServices = async () => {
    try {
      const nextPage = currentServicePage + 1;
      const servicesData = await getAllServices(nextPage);

      // Cập nhật danh sách dịch vụ
      setServices((prevServices) => [
        ...prevServices,
        ...(servicesData.services || []),
      ]);

      setCurrentServicePage(nextPage);
    } catch (error) {
      console.error('Error fetching more services:', error);
    }
  };

  const loadMoreProducts = async () => {
    try {
      const nextPage = currentProductPage + 1;
      const productsData = await getAllProduct(nextPage);

      // Cập nhật danh sách dịch vụ
      setProducts((prevProducts) => [
        ...prevProducts,
        ...(productsData.products || []),
      ]);

      setCurrentProductPage(nextPage);
    } catch (error) {
      console.error('Error fetching more products:', error);
    }
  };

  const handleServiceSelect = (service) => {
    if (
      selectedServices.some((selected) => selected.serviceId === service._id)
    ) {
      removeSelectedService(service._id);
    } else {
      setSelectedServices([
        ...selectedServices,
        { serviceId: service._id, name: service.name, price: service.price },
      ]);
    }
  };

  const handleProductSelect = (value) => {
    const selectedProduct = products.find((product) => product._id === value);

    if (selectedProducts.some((product) => product.productId === value)) {
      removeSelectedProduct(value);
    } else {
      setCurrentProduct(selectedProduct);
      setPopupVisible(true);
    }
  };

  const handleVariantSelect = (variant, quantity) => {
    const selectedProductId = currentProduct._id;

    setSelectedProducts([
      ...selectedProducts,
      {
        productId: selectedProductId,
        variantId: variant._id,
        volume: variant.volume,
        quantity: parseInt(quantity),
        name: currentProduct.name,
        price: currentProduct.price,
      },
    ]);

    // Đóng popup sau khi chọn xong
    setPopupVisible(false);
  };

  const removeSelectedService = (serviceId) => {
    setSelectedServices(
      selectedServices.filter((service) => service.serviceId !== serviceId)
    );
  };

  const removeSelectedProduct = (productId) => {
    setSelectedProducts(
      selectedProducts.filter((product) => product.productId !== productId)
    );
  };

  const handleSubmit = async () => {
    openSnackbar({
      text: 'Loading...',
      type: 'loading',
      duration: 20000,
    });

    const formattedDateTime = moment(
      `${bookingDate} ${bookingTime}`,
      'YYYY-MM-DD HH:mm'
    ).format('DD/MM/YYYY HH:mm');

    const bookingData = {
      date: formattedDateTime,
      services: selectedServices.map((service) => service.serviceId),
      products: selectedProducts.map((product) => ({
        productId: product.productId,
        variantId: product.variantId || null,
        quantity: product.quantity,
      })),
    };

    console.log(bookingData);

    try {
      const result = await createBookingAPI(bookingData, accessToken);
      if (result) {
        openSnackbar({
          text: 'Success',
          type: 'success',
          duration: 5000,
        });
        navigate('/booking');
      } else {
        openSnackbar({
          text: 'Error: ' + result?.message,
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      openSnackbar({
        text: 'Error',
        type: 'error',
      });
    }
  };

  return (
    <Page className="page">
      <Header />
      <div className="p-4 mt-14 mb-14">
        <div className="bg-white p-4 rounded-lg border border-gray-500 shadow-md">
          <h1 className="text-2xl mb-4 text-center custom-font">
            THÔNG TIN ĐẶT HẸN
          </h1>

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
          <Button onClick={openServiceSheet} fullWidth className="my-3">
            Chọn Dịch Vụ
          </Button>
          <div className="mt-3">
            {selectedServices.map((service) => (
              <Box key={service.serviceId} className="flex items-center">
                <Grid columnCount={2} className="border-2 p-3 rounded mb-2">
                  <Stack space="1rem" style={{ width: '15rem' }}>
                    <div>{service.name}</div>
                    <div>{service.price.toLocaleString()} VND</div>
                  </Stack>
                  <button
                    className="ml-2 text-blue-500"
                    onClick={() => removeSelectedService(service.serviceId)}
                  >
                    <Icon icon="zi-close" className="text-orange-500" />
                  </button>
                </Grid>
              </Box>
            ))}
          </div>

          <Text className="mt-4">Sản phẩm</Text>
          <Button onClick={openProductSheet} fullWidth>
            Chọn Sản Phẩm
          </Button>
          <div className="mt-3">
            {selectedProducts.map(
              ({ productId, volume, quantity, name, price }) => (
                <Box key={productId} className="flex items-center">
                  <Grid columnCount={3} className="border-2 p-3 rounded mb-2">
                    <Stack space="1rem" style={{ width: '11rem' }}>
                      <div>{name}</div>
                      <div>
                        {volume} - {price.toLocaleString()} VND
                      </div>
                    </Stack>

                    {/* Hiển thị số lượng */}
                    <Input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => {
                        const updatedQuantity = parseInt(e.target.value);

                        // Cập nhật số lượng trong selectedProducts
                        setSelectedProducts(
                          selectedProducts.map((product) =>
                            product.productId === productId
                              ? { ...product, quantity: updatedQuantity }
                              : product
                          )
                        );
                      }}
                    />
                    <button
                      className="ml-2 text-blue-500"
                      onClick={() => removeSelectedProduct(productId)}
                    >
                      <Icon icon="zi-close" className="text-orange-500" />
                    </button>
                  </Grid>
                </Box>
              )
            )}
          </div>
        </div>

        <button
          className="mt-5 h-10 w-full rounded-full flex items-center justify-center bg-red-500"
          onClick={handleSubmit}
        >
          <span className="ml-2 text-base text-white">Đặt lịch</span>
        </button>
      </div>

      {/* DỊCH VỤ */}
      <Sheet
        visible={showServiceSheet}
        onClose={closeServiceSheet}
        autoHeight
        title="Dịch Vụ"
        mask
        handler
        swipeToClose
      >
        <Page className="section-container">
          <Box
            p={4}
            className="custom-bottom-sheet"
            flex
            flexDirection="column"
          >
            <Input
              placeholder="Tìm kiếm..."
              value={serviceKeyword}
              onChange={(e) => setServiceKeyword(e.target.value)}
            />

            <Grid
              columnSpace="1rem"
              rowSpace="1rem"
              columnCount={2}
              className="mt-3"
            >
              {services.map((service) => (
                <div
                  key={service._id}
                  onClick={() => handleServiceSelect(service)}
                >
                  <Box className="relative">
                    <input
                      type="checkbox"
                      className="absolute top-2 right-2 z-10"
                      checked={selectedServices.some(
                        (selected) => selected.serviceId === service._id
                      )}
                    />
                    <img
                      src={service.images[0]}
                      className="w-full aspect-square object-cover rounded-t-lg"
                      alt={service.name}
                    />
                    <div className="py-2">
                      <div className="text-sm h-9 line-clamp-2 mb-2">
                        {service.name}
                      </div>
                      <div className="mt-0.5 text-sm font-medium">
                        {service.price.toLocaleString() + ' VND'}
                      </div>
                    </div>
                  </Box>
                </div>
              ))}
            </Grid>
            {currentServicePage < serviceTotalPages && (
              <h2
                className="mb-5 mt-2 w-100"
                style={{ textAlign: 'center' }}
                onClick={loadMoreServices}
              >
                Xem thêm
              </h2>
            )}
          </Box>
          <div className="mb-7 mt-5 w-100"></div>
        </Page>
      </Sheet>

      {/* SẢN PHẨM */}
      <Sheet
        visible={showProductSheet}
        onClose={closeProductSheet}
        autoHeight
        title="Sản phẩm chọn thêm"
        mask
        handler
        swipeToClose
      >
        <Page className="section-container">
          <Box
            p={4}
            className="custom-bottom-sheet"
            flex
            flexDirection="column"
          >
            <Input
              placeholder="Tìm kiếm..."
              value={productKeyword}
              onChange={(e) => setProductKeyword(e.target.value)}
            />

            <Grid
              columnSpace="1rem"
              rowSpace="1rem"
              columnCount={2}
              className="mt-3"
            >
              {products.map((product) => (
                <div
                  key={product._id}
                  onClick={() => handleProductSelect(product._id)}
                >
                  <Box className="relative">
                    <input
                      type="checkbox"
                      className="absolute top-2 right-2 z-10"
                      checked={selectedProducts.some(
                        (selected) => selected.productId === product._id
                      )}
                    />
                    <img
                      src={product.images[0]}
                      className="w-full aspect-square object-cover rounded-t-lg"
                      alt={product.name}
                    />
                    <div className="py-2">
                      <div className="text-sm h-9 line-clamp-2 mb-2">
                        {product.name}
                      </div>
                      <div className="mt-0.5 text-sm font-medium">
                        {product.price.toLocaleString() + ' VND'}
                      </div>
                    </div>
                  </Box>
                </div>
              ))}
            </Grid>
            {currentProductPage < productTotalPages && (
              <h2
                className="mb-5 mt-2 w-100"
                style={{ textAlign: 'center' }}
                onClick={loadMoreProducts}
              >
                Xem thêm
              </h2>
            )}
          </Box>
          <div className="mb-7 mt-5 w-100"></div>
        </Page>
      </Sheet>

      {/* VARIANTS SELECTION MODAL */}
      <Modal
        visible={popupVisible}
        title="Chọn Loại Sản Phẩm"
        onClose={() => setPopupVisible(false)} // Đóng Modal
        verticalActions
      >
        <Box p={6}>
          {currentProduct?.variants.map((variant) => (
            <Box mt={6} key={variant._id}>
              <Radio
                name="variant"
                value={variant._id}
                label={`${variant.volume} - ${variant.price.toLocaleString()} VNĐ`}
                onChange={() => setSelectedVariant(variant)}
              />
            </Box>
          ))}

          <Input
            label="Số lượng"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            visibilityToggle
          />

          <Button
            onClick={() => handleVariantSelect(selectedVariant, quantity)}
            fullWidth
          >
            Xác Nhận
          </Button>
        </Box>
      </Modal>

      {/* Hiển thị thông báo */}
      {/* <Modal
        visible={dialogVisible}
        title={dialogMessage}
        onClose={() => setDialogVisible(false)}
        actions={[
          {
            text: "Xác nhận",
            close: true,
            highLight: true,
            onClick: () => {
              setDialogVisible(false); // Đóng modal
              navigate('/booking'); // Chuyển trang
            },
          },
        ]}
      /> */}
    </Page>
  );
};

export default BookingFormPage;
