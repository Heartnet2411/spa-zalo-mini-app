import React, { Suspense } from "react";
import { Route} from 'react-router-dom'
import { App, ZMPRouter, AnimationRoutes, SnackbarProvider } from 'zmp-ui'; 
import { RecoilRoot } from 'recoil';
import HomePage from '../pages';
import Booking from '../pages/booking';
import Shop from '../pages/shop';
import Profile from '../pages/profile';
import Taskbar from "../components/taskbar";

const MyApp = () => {
  return (
    <RecoilRoot>
      <App >
      <SnackbarProvider>
        <ZMPRouter>
          <AnimationRoutes>
            <Route path="/" element={<HomePage></HomePage>}></Route>
            <Route path="/booking" element={<Booking></Booking>}></Route>
            <Route path="/shop" element={<Shop></Shop>}></Route>
            <Route path="/profile" element={<Profile></Profile>}></Route>
          </AnimationRoutes>
          <Taskbar />
        </ZMPRouter>
      </SnackbarProvider>
      </App>
    </RecoilRoot>
  );

}
export default MyApp;