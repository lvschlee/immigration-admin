import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { collection, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
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

import { db, storage } from '../firebase';

const initialPost = {
  title: '',
  description: '',
  thumb: '',
};

export function Orders() {
  const [editItem, setEditItem] = useState<any>(initialPost);
  const [uploading, setUploading] = useState(false);
  const [fileStoragePath, setFileStoragePath] = useState<string>();
  const [posts, loading] = useCollectionData(collection(db, 'posts'), {
    idField: 'id',
  });

  const [isModalVisible, setIsModalVisible] = useState(false);

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

  // Move to use dispatch or context API
  const isEditMode = !!editItem.title;

  const onFinish = async (values: any) => {
    try {
      await setDoc(doc(db, 'posts', isEditMode ? editItem.id : uuid()), {
        ...values,
        thumb: fileStoragePath ? fileStoragePath : editItem.thumb,
      });
    } catch (e) {
      console.info(e);
    } finally {
      setEditItem(false);
      setIsModalVisible(false);
      setFileStoragePath(undefined);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setEditItem(false);
    setIsModalVisible(false);
    setFileStoragePath(undefined);
  };

  // It's bad i know :(
  const handleEdit = (id: string) => {
    const editPost = posts?.find((post) => post.id === id);
    setEditItem(editPost);
    setIsModalVisible(true);
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
          title="Записи"
          extra={[
            <Button type="primary" onClick={showModal}>
              Добавить
              <PlusOutlined />
            </Button>,
          ]}
        />
        <Divider />

        <Table items={posts} onEditClick={handleEdit} />
      </div>

      <Modal
        centered
        cancelText="отменить"
        destroyOnClose={true}
        title={isEditMode ? 'Редактирование записи' : 'Новая запись'}
        okText={isEditMode ? 'сохранить' : 'создать'}
        visible={isModalVisible}
        onCancel={handleCancel}
        afterClose={handleCancel}
        okButtonProps={{
          form: 'myForm',
          htmlType: 'submit',
          disabled: uploading,
        }}
      >
        <Form
          name="basic"
          id="myForm"
          initialValues={{
            remember: true,
            title: editItem.title,
            description: editItem.description,
          }}
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
              try {
                setUploading(true);

                const storageFilePath = 'posts/'.concat(props.file.name);
                const imgRef = ref(storage, storageFilePath);

                await uploadBytes(imgRef, props.file);
                setFileStoragePath(storageFilePath);
              } catch (e) {
                console.info(e);
              } finally {
                setUploading(false);
              }
            }}
          >
            <UploadOutlined />
          </Upload>
        </Form>
      </Modal>
    </>
  );
}
