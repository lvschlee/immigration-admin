import 'antd/dist/antd.css';
import './styles.css';

import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { collection, doc, setDoc } from 'firebase/firestore';
import { ref, getStorage, uploadBytes } from 'firebase/storage';
import {
  Button,
  Layout,
  Divider,
  PageHeader,
  Modal,
  Form,
  Input,
  Upload,
  message,
} from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';

import { Menu, Table } from './components';

import { app, db } from './firebase';

const { Header, Content, Sider } = Layout;

export function App() {
  const [posts, loading] = useCollectionData(collection(db, 'posts'), {
    idField: 'id',
  });

  const [isModalVisible, setIsModalVisible] = useState(false);

  const storage = getStorage(app);

  const props = {
    name: 'file',
    onChange(info: any) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const onFinish = async (values: any) => {
    await setDoc(doc(db, 'posts', uuid()), values);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  if (loading) {
    return <p>loading</p>;
  }

  return (
    <>
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
            <PageHeader
              ghost={false}
              onBack={() => window.history.back()}
              title="Записи"
              extra={[
                <Button type="primary" onClick={showModal}>
                  Добавить
                  <PlusOutlined />
                </Button>,
              ]}
            />
            <Divider />

            <Table items={posts} />
          </Content>
        </Layout>
      </Layout>

      <Modal
        title="Новая запись"
        centered
        okText="создать"
        cancelText="отменить"
        visible={isModalVisible}
        onCancel={handleCancel}
        okButtonProps={{
          form: 'myForm',
          htmlType: 'submit',
        }}
      >
        <Form
          name="basic"
          id="myForm"
          initialValues={{ remember: true }}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="title"
            rules={[{ required: true, message: 'Поле не может быть пустым' }]}
          >
            <Input placeholder="Название" />
          </Form.Item>
          <Form.Item
            name="description"
            rules={[{ required: true, message: 'Поле не может быть пустым' }]}
          >
            <Input.TextArea autoSize={{ minRows: 6, maxRows: 10 }} />
          </Form.Item>
          <Divider />
          <Upload
            {...props}
            maxCount={1}
            listType="picture-card"
            customRequest={async (props: any) => {
              console.info(props);
              await uploadBytes(ref(storage, `posts/${props.file.name}`), props.file);
            }}
          >
            <UploadOutlined />
          </Upload>
        </Form>
      </Modal>
    </>
  );
}
