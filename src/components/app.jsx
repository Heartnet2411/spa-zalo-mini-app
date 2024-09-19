import React, { Suspense } from 'react';
import { Route, useLocation } from 'react-router-dom';
import { App, ZMPRouter, AnimationRoutes, SnackbarProvider } from 'zmp-ui';
import { RecoilRoot } from 'recoil';
import HomePage from '../pages';
import Booking from '../pages/booking';
import Shop from '../pages/shop';
import Profile from '../pages/profile';
import Taskbar from '../components/taskbar';
import ProductDetail from '../pages/productdetail';
import CartPage from '../pages/cart';

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
              <Route path="/shop" element={<Shop></Shop>}></Route>
              <Route path="/profile" element={<Profile></Profile>}></Route>
              <Route path="/product/:id" element={<ProductDetail />}></Route>
              <Route path="/cart" element={<CartPage />} />
            </AnimationRoutes>
            <Taskbar />
          </ZMPRouter>
        </SnackbarProvider>
      </App>
    </RecoilRoot>
  );
};
export default MyApp;
