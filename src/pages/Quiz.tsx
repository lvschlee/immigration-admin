import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { collection, doc, setDoc } from 'firebase/firestore';
import { ref, getStorage, uploadBytes } from 'firebase/storage';
import {
  Button,
  Divider,
  PageHeader,
  Modal,
  Form,
  Input,
  Upload,
  message,
} from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';

import { Table } from '../components';

import { app, db } from '../firebase';

export function Quiz() {
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
      <div>
        <PageHeader
          ghost={false}
          onBack={() => window.history.back()}
          title="Опросник"
          extra={[
            <Button type="primary" onClick={showModal}>
              Добавить
              <PlusOutlined />
            </Button>,
          ]}
        />
        <Divider />

        <Table items={posts} />
      </div>

      
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
