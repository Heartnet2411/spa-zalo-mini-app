import React, { useEffect, useState } from 'react';
import { Button, Page, Text, Icon } from 'zmp-ui';
import Header from '../components/header';
import { getReferralInfo } from '../services/referral.service'; 
import { useRecoilValue } from 'recoil';
import { userState } from '../state';

const ReferralPage = () => {
  const [referralData, setReferralData] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const { userInfo: user, accessToken } = useRecoilValue(userState);
  
  // Lấy referralCode từ user
  const referralCode = user.referralCode; 

  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        const data = await getReferralInfo(referralCode, accessToken);
        setReferralData(data); 
      } catch (err) {
        setError(err.message); 
      } finally {
        setLoading(false); 
      }
    };

    fetchReferralData();
  }, [referralCode, accessToken]); 

  if (loading) return <p>Loading...</p>; 
  if (error) return <p>Error: {error}</p>; 

  return (
    <Page className="page">
      <Header />
      <div className="p-4 mt-14 mb-14">
        <div className="mt-3">
          <div className="w-80 rounded-lg border flex flex-col items-center justify-center">
            <span className="text-xl mb-1">Hoa hồng nhận được</span>
            <div className="flex items-center text-orange-500">
              <span className="text-3xl">{referralData.user.amounts || 0} VND</span> {/* Hiển thị số tiền hoa hồng */}
            </div>
          </div>
        </div>

        {/* Hiển thị thông tin người dùng hiện tại */}
        <div className="w-80 rounded-lg border flex flex-col items-center justify-center mt-5">
          <span className="text-xl">Người dùng hiện tại</span>
          <Text>{referralData.user.name} - {referralData.user.zaloId}</Text>
          <Text className="text-gray-500">Mã giới thiệu: {referralData.user.referralCode}</Text>
        </div>

        {/* Hiển thị thông tin người giới thiệu (cha) */}
        {referralData.parent && (
          <div className="w-80 rounded-lg border flex flex-col items-center justify-center mt-5">
            <span className="text-xl">Người giới thiệu</span>
            <Text>{referralData.parent.name} - {referralData.parent.zaloId}</Text>
            <Text className="text-gray-500">Mã giới thiệu: {referralData.parent.referralCode}</Text>
          </div>
        )}

        {/* Hiển thị danh sách con cháu (nếu có) */}
        <div className="w-80 flex items-center justify-center mt-5">
          <span className="text-xl text-green-500">Danh sách giới thiệu</span>
        </div>
        <div className="mt-5">
          {referralData.descendants.length > 0 ? (
            referralData.descendants.map((descendant) => (
              <div key={descendant.referralCode} className="rounded-lg border p-2 mb-2">
                <Text>{descendant.name} - {descendant.zaloId}</Text>
              </div>
            ))
          ) : (
            <Text>Không có</Text>
          )}
        </div>
      </div>
    </Page>
  );
};

export default ReferralPage;
