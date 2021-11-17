import { Table as AntTable, Button } from 'antd';

import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

import { db, storage } from '../../firebase';
import { useDocument, useImage } from '../../hooks';

import { PostImage } from '..';

export function Table({ items, onEditClick }: any) {
  const { remove: removeDocument, loading: isRemoveInProgress } = useDocument(
    db,
    'posts'
  );
  const { remove: removeImage, loading: isImageRemoveInProgress } = useImage(
    storage,
    'posts'
  );

  const columns = [
    {
      title: 'Название',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Миниатюра',
      dataIndex: 'thumb',
      key: 'thumb',
      render(text: string) {
        return <PostImage src={text} />;
      },
    },
    {
      title: 'Описание',
      dataIndex: 'description',
      key: 'description',
      render(text: string) {
        return text.slice(0, 128).concat('...');
      },
    },
    {
      title: 'Действия',
      dataIndex: 'actions',
      render: (text: string, record: any) => (
        <div>
          <Button
            onClick={() => {
              onEditClick(record.id);
            }}
          >
            <EditOutlined />
          </Button>
          <Button
            onClick={() => {
              removeDocument(record.id);
              removeImage(record.thumb);
            }}
          >
            <DeleteOutlined />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AntTable
      columns={columns}
      dataSource={items}
      loading={isRemoveInProgress || isImageRemoveInProgress}
    />
  );
}
