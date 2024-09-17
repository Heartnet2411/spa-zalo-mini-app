import React, { Suspense } from "react";
import { List, Page, Icon, useNavigate } from "zmp-ui";
import UserCard from "../components/user-card";
import Taskbar from "../components/taskbar";

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Page className="page">
        <Suspense>
          <div className="section-container">
            <span> Trang chủ</span>
          </div>
        </Suspense>
        
      </Page>
      <Taskbar/>
    </div>
  );
};

export default HomePage;
