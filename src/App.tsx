import 'antd/dist/antd.css';
import './styles.css';

import { useCollectionData } from 'react-firebase-hooks/firestore';
import { collection } from 'firebase/firestore';
import { Layout } from 'antd';

import { Menu, Table } from './components';

import { db } from './firebase';

const { Header, Content, Sider } = Layout;

export function App() {
  const [posts, loading] = useCollectionData(collection(db, 'posts'), {
    idField: 'id',
  });


  if (loading) {
    return <p>loading</p>;
  }

  return (
    <Layout>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
      >
        <div className="logo" />
        <Menu />
      </Sider>
      <Layout>
        <Header
          className="site-layout-sub-header-background"
          style={{ padding: 0 }}
        />
        <Content style={{ margin: '24px 16px 0' }}>
          <Table items={posts} />
        </Content>
      </Layout>
    </Layout>
  );
}
