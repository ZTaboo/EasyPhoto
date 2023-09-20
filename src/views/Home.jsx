import {Layout, Menu, Button, theme} from 'antd';
import {startTransition, useEffect, useState} from "react";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons'
import {Outlet, useLocation, useNavigate} from "react-router-dom";

const {Header, Sider, Content} = Layout;
const Home = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: {colorBgContainer},
    } = theme.useToken();
    const router = useNavigate()
    const location = useLocation()
    useEffect(() => {
        if (location.pathname === "/") {
            router('/dash')
        }
    }, [])
    const menus = [
        {
            key: 'dash',
            icon: <UserOutlined/>,
            label: '证件照制作',
        },
        {
            key: 'matting',
            icon: <VideoCameraOutlined/>,
            label: '人像抠图',
        },
    ]
    return (
        <Layout style={{height: '100%'}}>
            <Sider trigger={null} collapsible collapsed={collapsed} theme={'light'}>
                <Menu
                    mode="inline"
                    onClick={(item) => {
                        router(item.key)
                    }}
                    defaultSelectedKeys={['dash']}
                    items={menus}
                />
            </Sider>
            <Layout>
                <Header style={{
                    padding: 0,
                    background: colorBgContainer,
                    height: 34,
                    display: 'flex',
                    alignItem: 'center'
                }}>
                    <Button
                        type="text"
                        style={{marginTop: '1px'}}
                        icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                        onClick={() => setCollapsed(!collapsed)}
                    />
                </Header>
                <Content
                    style={{
                        margin: '5px 5px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        overflow: 'auto',
                    }}
                >
                    <Outlet></Outlet>
                </Content>
            </Layout>
        </Layout>
    )
}
export default Home;