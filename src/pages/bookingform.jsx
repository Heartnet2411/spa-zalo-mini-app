import React, { Suspense, useState } from 'react';
import { Button, Page, Text, useNavigate, Input, Select } from 'zmp-ui';
import Header from '../components/header';
import {userState} from '../state'
import { useRecoilValue, useSetRecoilState } from 'recoil';
const BookingFormPage = () => {
 
  const setUserState = useSetRecoilState(userState);
  const { userInfo: user, phoneNumber } = useRecoilValue(userState);

  return (
    <Page className="page">
      <Header/>
      <div className="p-4 mt-14 mb-14">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h1 className="text-1xl mb-4 custom-font ">THÔNG TIN KHÁCH HÀNG</h1>
          <Text>Họ và tên</Text>
          <Input 
            id="name"
            type="text"
            value={user.name}
          />
          <Text>Số điện thoại liên hệ</Text>
          <Input placeholder="Nhập số điện thoại"></Input>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md mt-5">
          <h1 className="text-1xl mb-4 custom-font ">THÔNG TIN ĐẶT HẸN</h1>
          <Text>Chi nhánh</Text>
          <select
            className="w-full p-3 px-5 rounded border"
            // value={selectedBranch}
            //placeholder="Chọn chi nhánh"
            // onChange={(value) => {
            //   setSelectedBranch(value);
            //   console.log('Selected branch:', value);
            // }}
          >
            <option value="phu-nhuan">Phú Nhuận</option>
            <option value="go-vap">Gò Vấp</option>
            <option value="binh-thanh">Bình Thạnh</option>
          </select>
          <Text>Ngày đặt lịch</Text>
          <Input></Input>
          <Text>Giờ đặt lịch</Text>
          <Input></Input>
          <Text>Ghi chú</Text>
          <textarea
            className="w-full p-4 border rounded"
            placeholder="Nhập ghi chú "
          ></textarea>
        </div>
        <button className="mt-5 h-8 w-full rounded-full flex items-center justify-center bg-blue-500">
          <span className="ml-2 text-base text-white">Thêm dịch vụ</span>
        </button>
        <button className="mt-5 h-8 w-full rounded-full flex items-center justify-center bg-blue-500">
          <span className="ml-2 text-base text-white">Thêm sản phẩm</span>
        </button>
        <button className="mt-5 h-8 w-full rounded-full flex items-center justify-center bg-red-500">
          <span className="ml-2 text-base text-white">Đặt lịch</span>
        </button>
      </div>
    </Page>
  );
};

export default BookingFormPage;
