import React, { Suspense } from 'react';
import { Route, useLocation } from 'react-router-dom';
import { App, ZMPRouter, AnimationRoutes, SnackbarProvider } from 'zmp-ui';
import { RecoilRoot } from 'recoil';
import HomePage from '../pages';
import Booking from '../pages/booking';
import Shop from '../pages/shop';
import Profile from '../pages/profile';
import Taskbar from "../components/taskbar";
import Form from '../pages/form';
import ProductDetail from '../pages/product-detail';
import CartPage from '../pages/cart';
import BookingForm from '../pages/bookingform'; 
import Rating from '../pages/rating';
import RatingDetail from '../pages/ratingdetail';
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
              <Route path="/bookingform" element={<BookingForm></BookingForm>}></Route>
              <Route path="/shop" element={<Shop></Shop>}></Route>
              <Route path="/profile" element={<Profile></Profile>}></Route>
              <Route path="/rating" element={<Rating></Rating>}></Route>
              <Route path="/ratingdetail" element={<RatingDetail></RatingDetail>}></Route>
              <Route path="/product/:id" element={<ProductDetail />}></Route>
              <Route path="/cart" element={<CartPage />} />
              <Route path="/form" element={<Form></Form>}></Route>
            </AnimationRoutes>
            <Taskbar />
          </ZMPRouter>
        </SnackbarProvider>
      </App>
    </RecoilRoot>
  );
};
export default MyApp;
