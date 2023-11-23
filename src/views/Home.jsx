import { Layout, Menu, Button, theme, message } from "antd";
import { useEffect, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  MoreOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api";
const { Header, Sider, Content } = Layout;
const Home = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const router = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/") {
      router("/dash");
    }
    setTimeout(() => {
      invoke("close_splashscreen");
    }, 1000);
    // 禁用邮件
    document.oncontextmenu = function (e) {
      return false;
    };
  }, []);
  const menus = [
    {
      key: "dash",
      icon: <UserOutlined />,
      label: "证件照制作",
    },
    {
      key: "matting",
      icon: <VideoCameraOutlined />,
      label: "人像抠图",
    },
    {
      key: "more",
      icon: <MoreOutlined />,
      label: "更多",
    },
  ];
  return (
    <Layout style={{ height: "100%" }}>
      {contextHolder}
      <Sider trigger={null} collapsible collapsed={collapsed} theme={"light"}>
        <Menu
          mode="inline"
          onClick={(item) => {
            if (item.key === "more") {
              messageApi.info("更多功能正在开发中...");
            } else {
              router(item.key);
            }
          }}
          defaultSelectedKeys={["dash"]}
          items={menus}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: "#F5F7FA",
            height: 34,
            display: "flex",
            alignItem: "center",
          }}
        >
          <Button
            type="text"
            style={{ marginTop: "1px" }}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
        </Header>
        <Content
          style={{
            margin: "5px 5px",
            padding: 24,
            minHeight: 280,
            background: "#F5F7FA",
            overflow: "auto",
          }}
        >
          <Outlet></Outlet>
        </Content>
      </Layout>
    </Layout>
  );
};
export default Home;
