import { AppstoreOutlined, HomeOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { useRedirect } from '@common/hooks';
import { Layout, Menu } from 'antd';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import './styles.less';

const { Header, Sider, Content, Footer } = Layout;

const HomeLayout = ({ theme = "dark", defaultSelectedKeys = [] }) => {
    const { gotoPage } = useRedirect();
    const [collapsed, setCollapsed] = useState(true);
    const items = [
        {
            key: 'online',
            icon: <HomeOutlined />,
            label: '课件'
        },
        {
            key: 'module',
            icon: <AppstoreOutlined />,
            label: '模块'
        },
        {
            key: 'chinese',
            icon: <MailOutlined />,
            label: '田字格'
        },
        {
            key: 'test',
            icon: <SettingOutlined />,
            label: '测试'
        }
    ];

    return (
        <Layout className="home-layout">
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="logo" >首页</div>
                <Menu
                    theme={theme}
                    mode="inline"
                    items={items}
                    defaultSelectedKeys={defaultSelectedKeys}
                    onSelect={({ key }) => gotoPage(key)}
                    />
            </Sider>
            <Layout className="site-layout-content">
                <Content>
                    <Outlet />
                </Content>

                <Footer>Course-Tools ©2023 Created by Innev</Footer>
            </Layout>
        </Layout>
    );
};

export default HomeLayout;