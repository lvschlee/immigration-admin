import 'antd/dist/antd.css';
import './styles.css';

import { initializeApp } from 'firebase/app';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { getFirestore, collection } from 'firebase/firestore';
import { Layout, Menu, Table, Button } from 'antd';

import { useDocument } from './hooks';

import {
  DashboardOutlined,
  AuditOutlined,
  ContainerOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';

import { firebaseConfig } from './config';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

type Post = {
  title: string;
};

const { Header, Content, Sider } = Layout;

export function App() {
  const [posts, loading] = useCollectionData(collection(db, 'posts'), {
    idField: 'id',
  });
  const { remove } = useDocument(db, 'posts');

  if (loading) {
    return <p>loading</p>;
  }

  const columns = [
    {
      title: 'Название',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Описание',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Действия',
      dataIndex: 'actions',
      render: (text: string, record: any) => (
        <div>
          <Button
            onClick={async () => {
              console.info(record.id);
            }}
          >
            <EditOutlined />
          </Button>
          <Button
            onClick={() => remove(record.id)}
          >
            <DeleteOutlined />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
      >
        <div className="logo" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            Главная
          </Menu.Item>
          <Menu.Item key="2" icon={<AuditOutlined />}>
            Заявки
          </Menu.Item>
          <Menu.Item key="3" icon={<ContainerOutlined />}>
            Посты
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header
          className="site-layout-sub-header-background"
          style={{ padding: 0 }}
        />
        <Content style={{ margin: '24px 16px 0' }}>
          <Table columns={columns} dataSource={posts} />
        </Content>
      </Layout>
    </Layout>
  );
}
