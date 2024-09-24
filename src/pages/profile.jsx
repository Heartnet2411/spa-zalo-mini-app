import React, { useEffect } from 'react';
import {
  Avatar,
  List,
  Text,
  Box,
  Page,
  Button,
  Icon,
  useNavigate,
} from 'zmp-ui';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userState, fetchUserData } from '../state';

const ProfilePage = () => {
  const setUserState = useSetRecoilState(userState);
  const { userInfo: user, phoneNumber } = useRecoilValue(userState);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const { userInfo, phoneNumber } = await fetchUserData();
        setUserState({ userInfo, phoneNumber });
      } catch (error) {
        console.error(error);
      }
    };

    getUserData();
  }, [setUserState]);

  return (
    <div>
      <Page className="page">
        <Box
          flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Box mt={10}>
            <Avatar
              story="default"
              size={96}
              online
              src={
                user.avatar && user.avatar.startsWith('http')
                  ? user.avatar
                  : undefined
              }
            >
              {user.avatar}
            </Avatar>
          </Box>
          <Box flex flexDirection="row" alignItems="center" ml={8}>
            <Box>
              <Text.Title>{user.name}</Text.Title>
            </Box>
            <Box ml={4}>
              <Button
                onClick={() => {
                  navigate('/form');
                }}
                size="small"
                icon={<Icon icon="zi-edit" />}
              />
            </Box>
          </Box>
        </Box>
        <Box m={0} p={0} mt={4}>
          <div className="section-container">
            <List>
              <List.Item title="Họ tên" subTitle={user.name}/>
              <List.Item title="ID" subTitle={user.id}/>
              <List.Item title="Số điện thoại" subTitle={phoneNumber}/> 
            </List>
          </div>
        </Box>
      </Page>
    </div>
  );
};

export default ProfilePage;
