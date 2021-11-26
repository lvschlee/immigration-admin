import 'antd/dist/antd.css';
import './styles.css';

import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';

import { Menu } from './components';
import { RootStateProvider } from './RootStateContext';

const { Header, Content, Sider } = Layout;

export function App() {
  return (
    <RootStateProvider>
      <Layout>
        <Sider breakpoint="lg" collapsedWidth="0">
          <div className="logo" />
          <Menu />
        </Sider>
        <Layout>
          <Header
            className="site-layout-sub-header-background"
            style={{ padding: 0 }}
          />
          <Content style={{ margin: '24px 16px 0' }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </RootStateProvider>
  );
}
