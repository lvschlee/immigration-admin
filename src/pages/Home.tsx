import { useCollectionData } from 'react-firebase-hooks/firestore';
import { collection } from 'firebase/firestore';

import { Divider, PageHeader, Table, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

import { db } from '../firebase';
import { useDocument } from '../hooks';

export function Home() {
  const [orders, loading] = useCollectionData(collection(db, 'orders'), {
    idField: 'id',
  });
  const { remove, loading: isRemoveInProgress } = useDocument(db, 'orders');
  const _loading = loading || isRemoveInProgress;

  const columns = [
    {
      title: 'ФИО',
      dataIndex: 'fio',
      key: 'fio',
    },
    {
      title: 'Номер телефона',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'email',
      dataIndex: 'email',
    },
    {
      title: 'Результат опроса',
      dataIndex: 'answers',
      key: 'answers',
      render: (text: string, record: any) => {
        if (!record?.answers?.length) {
          return <div>-</div>;
        }

        return (
          <ul>
            {record.answers.map(({ question, answer }: any) => (
              <li key={question + answer}>
                <div>
                  <strong>Вопрос:</strong>
                  &nbsp;{question}
                </div>
                <div>
                  <strong>Ответ:</strong>
                  &nbsp;{answer}
                </div>
              </li>
            ))}
          </ul>
        );
      },
    },
    {
      title: 'Действия',
      dataIndex: 'actions',
      render: (_text: string, record: any) => (
        <Button onClick={() => remove(record.id)}>
          <DeleteOutlined />
        </Button>
      ),
    },
  ];

  if (loading) {
    return <p>loading</p>;
  }

  return (
    <>
      <PageHeader
        ghost={false}
        onBack={() => window.history.back()}
        title="Заявки"
      />
      <Divider />

      <Table columns={columns} dataSource={orders} loading={_loading} />
    </>
  );
}
