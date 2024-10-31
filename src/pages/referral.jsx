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
        <div className="">
          <div className="w-80 rounded-lg flex flex-col items-center justify-center">
            <h1 className="text-xl mb-4 text-center custom-font">
              Hoa hồng nhận được
            </h1>
            <div className="flex items-center text-orange-500">
              <span className="text-3xl">
                {user?.amounts?.toLocaleString('vi-VN') || 0} VND
              </span>{' '}
              {/* Hiển thị số tiền hoa hồng */}
            </div>
          </div>
        </div>

        {/* Hiển thị thông tin người dùng hiện tại */}
        <div className="w-80 rounded-lg border shadow-lg flex flex-col gap-2 justify-center my-5 py-4 px-1">
          <span className="text-lg font-semibold ml-2">
            Người dùng hiện tại :
          </span>
          <div className="text-center flex flex-col gap-1">
            <span className="text-xl text-blue-500">
              {referralData.user.name}
            </span>
            <span className="text-blue-900">({referralData.user.zaloId})</span>
          </div>
          <Text className="ml-2 pt-2">
            Mã giới thiệu:{' '}
            <span className="text-gray-500 italic text-lg">
              {referralData.user.referralCode}
            </span>
          </Text>
        </div>

        {/* Hiển thị thông tin người giới thiệu (cha) */}
        {referralData.parent && (
          <div className="w-80 rounded-lg border shadow-lg flex flex-col gap-2 justify-center my-5 py-4 px-1">
            <span className="text-lg font-semibold ml-2">
              Người giới thiệu :
            </span>
            <div className="text-center flex flex-col gap-1">
              <span className="text-xl text-blue-500">
                {referralData.parent.name}
              </span>
              <span className="text-blue-900">
                ({referralData.parent.zaloId})
              </span>
            </div>
            <Text className="ml-2 pt-2">
              Mã giới thiệu:{' '}
              <span className="text-gray-500 italic text-lg">
                {referralData.parent.referralCode}
              </span>
            </Text>
          </div>
        )}

        {/* Hiển thị danh sách con cháu (nếu có) */}
        <div className="w-80 flex items-center justify-center mt-8 mb-3">
          <span className="text-xl font-bold">Danh sách giới thiệu</span>
        </div>
        <div>
          {referralData.descendants.length > 0 ? (
            referralData.descendants.map((descendant) => (
              <div
                key={descendant.referralCode}
                className="rounded-lg border p-2 mb-2"
              >
                <Text>
                  {descendant.name} ({descendant.zaloId})
                </Text>
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
