import React, { useEffect, useState } from 'react';
import { Button, Page, Text, Icon, Sheet, Box, Grid } from 'zmp-ui';
import Header from '../components/header';
import { getChildReferralHistoryByParent, getReferralInfo } from '../services/referral.service';
import { useRecoilValue } from 'recoil';
import { userState } from '../state';
import Pagination from '../components/pagination';

const ReferralPage = () => {
  const [referralData, setReferralData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userInfo: user, accessToken } = useRecoilValue(userState);

  const [selectedChildId, setSelectedChildId] = useState('');
  const [selectedChildName, setSelectedChildName] = useState('');
  const [selectedChildCode, setSelectedChildCode] = useState('');
  const [history, setHistory] = useState([]);
  const [currentHistoryPage, setCurrentHistoryPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(1);
  const [totalHistoryPages, setTotalHistoryPages] = useState(1);

  const [showHistorySheet, setShowHistorySheet] = useState(false);

  const openHistorySheet = () => setShowHistorySheet(true);
  const closeHistorySheet = () => setShowHistorySheet(false);

  // Lấy referralCode từ user
  const referralCode = user.referralCode;
  const userId = user.id;

  // TEST
  // const referralCode = '6B8784B1B263CF2C';
  // const userId = '670f92748dd7872eee897191';

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

  useEffect(() => {
    if (!selectedChildId) {
      return;
    }
    const fetchHistory = async () => {
      try {
        const data = await getChildReferralHistoryByParent(
          userId,
          selectedChildId,
          currentHistoryPage,
          accessToken
        );

        setHistory(data.history || []);
        setTotalRecords(data.totalRecords || 0);
        setTotalHistoryPages(data.totalPages || 1);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userId, selectedChildId, currentHistoryPage, accessToken]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleOpenHistory = (childId, name, referralCode) => {
    setSelectedChildId(childId);
    setSelectedChildName(name);
    setSelectedChildCode(referralCode);
    openHistorySheet();
  };


  const handlePageChange = (page) => {
    setCurrentHistoryPage(page);
  };

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
                className="rounded-lg border p-2 mb-2 shadow-lg"
              >
                <Text className="text-center ml-2 pt-2 text-xl">
                  <span className="text-blue-500">
                    {descendant.name}
                  </span>
                </Text>
                <Text className="text-center ml-2 pt-2">
                  <span className="text-gray-500 italic">
                    ({descendant.zaloId})
                  </span>
                </Text>
                <Text className="ml-2 pt-2">
                  Tổng hoa hồng kiếm về:{' '}
                </Text>
                <Text className="text-center ml-2 pt-2">
                  <span className="text-gray-500 italic text-lg">
                    {descendant.totalEarned?.toLocaleString('vi-VN') || 0} VND
                  </span>
                </Text>

                <div className="flex justify-end mt-2">
                  <button
                    className="p-2 h-10 border border-orange-500 rounded-lg"
                    onClick={() => handleOpenHistory(descendant?.userId, descendant?.name, descendant?.referralCode)}
                  >
                    <span className="text-orange-500">Xem lịch sử</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <Text>Không có</Text>
          )}
        </div>
      </div>

      {/* SẢN PHẨM */}
      <Sheet
        visible={showHistorySheet}
        onClose={closeHistorySheet}
        autoHeight
        title="Lịch sử hoa hồng"
        mask
        handler
        swipeToClose
      >
        <Page className="section-container">
          <Text className="text-center ml-2 pt-2">
            <span className="text-blue-500 text-lg">
              {selectedChildName}
            </span>
          </Text>
          <Text className="text-center ml-2 pt-2">
            Mã giới thiệu:{' '}
            <span className="text-gray-500 italic">
              {selectedChildCode}
            </span>
          </Text>
          <Box
            p={4}
            className="custom-bottom-sheet"
            flex
            flexDirection="column"
          >
            <Grid
              columnSpace="1rem"
              rowSpace="1rem"
              columnCount={1}
            // className="mt-3"
            >
              {history?.map((item) => (
                <div
                  key={item._id}
                  className="rounded-lg border p-4 mb-4 shadow-lg transition-transform duration-200 hover:scale-105 bg-white"
                >
                  <div className="flex justify-between items-center">
                    <Text className="text-gray-600 font-semibold">
                      Ngày mua:
                    </Text>
                    <Text className="text-gray-800">
                      {new Date(item.createdAt)
                        .getDate()
                        .toString()
                        .padStart(2, '0')}
                      /
                      {(new Date(item.createdAt).getMonth() + 1)
                        .toString()
                        .padStart(2, '0')}
                      /{new Date(item.createdAt).getFullYear()} -{' '}
                      {`${new Date(item.createdAt).getHours()}h${new Date(item.createdAt).getMinutes().toString().padStart(2, '0')}`}
                    </Text>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <Text className="text-gray-600 font-semibold">
                      Hoa hồng cho bạn:
                    </Text>
                    <Text className="text-gray-800">
                      {item.earnedAmount?.toLocaleString('vi-VN') || 0} VND
                    </Text>
                  </div>
                </div>
              ))}
            </Grid>
            {totalHistoryPages > 1 && (
              <Pagination
                currentPage={currentHistoryPage}
                totalPages={totalHistoryPages}
                onPageChange={handlePageChange}
              />
            )}
          </Box>
          <div className="mb-7 mt-5 w-100"></div>
        </Page>
      </Sheet>
    </Page>
  );
};

export default ReferralPage;
