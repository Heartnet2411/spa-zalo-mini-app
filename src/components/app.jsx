import React, { Suspense, useEffect } from 'react';
import { Route, useLocation } from 'react-router-dom';
import { App, ZMPRouter, AnimationRoutes, SnackbarProvider } from 'zmp-ui';
import { RecoilRoot } from 'recoil';
import HomePage from '../pages';
import Booking from '../pages/booking';
import Shop from '../pages/shop';
import Profile from '../pages/profile';
import Taskbar from '../components/taskbar';
import Form from '../pages/form';
import ProductDetail from '../pages/product-detail';
import CartPage from '../pages/cart';
import BookingForm from '../pages/bookingform';
import Rating from '../pages/rating';
import RatingDetail from '../pages/ratingdetail';
import OrderStatusPage from '../pages/order-status';
import VoucherPage from '../pages/voucher';
import ListVoucherPage from '../pages/list-voucher';
import PaymentPage from '../pages/payment';
import BookingDetailPage from '../pages/bookingdetail';
import PaymentResult from '../pages/payment-result';
import Game from '../pages/game';
import ReferralPage from '../pages/referral';
const MyApp = () => {
  //Hide taskbar with path

  return (
    <RecoilRoot>
      <App>
        <SnackbarProvider>
          <ZMPRouter>
            <AnimationRoutes>
              <Route path="/" element={<HomePage></HomePage>}></Route>
              <Route path="/booking" element={<Booking></Booking>}></Route>
              <Route
                path="/bookingform"
                element={<BookingForm></BookingForm>}
              ></Route>
              <Route
                path="/bookingdetail/:id"
                element={<BookingDetailPage></BookingDetailPage>}
              ></Route>
              <Route path="/shop" element={<Shop></Shop>}></Route>
              <Route path="/game" element={<Game></Game>}></Route>
              <Route path="/profile" element={<Profile></Profile>}></Route>
              <Route path="/rating" element={<Rating></Rating>}></Route>
              <Route
                path="/ratingdetail"
                element={<RatingDetail></RatingDetail>}
              ></Route>
              <Route path="/product/:id" element={<ProductDetail />}></Route>
              <Route path="/cart" element={<CartPage />} />
              <Route path="/form" element={<Form></Form>}></Route>
              <Route path="/order-status" element={<OrderStatusPage />}></Route>
              <Route path="/voucher" element={<VoucherPage />}></Route>
              <Route path="/list-voucher" element={<ListVoucherPage></ListVoucherPage>}></Route>
              <Route
                path="/payment"
                element={<PaymentPage></PaymentPage>}
              ></Route>
              <Route path="/payment-result" element={<PaymentResult />}></Route>
              <Route path="/referral" element={<ReferralPage/>}></Route>
            </AnimationRoutes>
            <Taskbar />
          </ZMPRouter>
        </SnackbarProvider>
      </App>
    </RecoilRoot>
  );
};
export default MyApp;
