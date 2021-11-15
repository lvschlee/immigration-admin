import { Table as AntTable, Button } from 'antd';

import {
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';

import { db } from '../../firebase';
import { useDocument } from '../../hooks';

export function Table({ items }: any) {
  const { remove, loading: isRemoveInProgress } = useDocument(db, 'posts');

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
      render(text: string) {
        return text.slice(0, 128).concat('...');
      }
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
          <Button onClick={() => remove(record.id)}>
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
      loading={isRemoveInProgress}
    />
  );
}
