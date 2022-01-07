import { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { collection, doc, setDoc } from 'firebase/firestore';

import { Button, Divider, PageHeader, Modal, Table } from 'antd';

import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

import { QuestionForm } from '../components/QuestionForm';
import { observer } from 'mobx-react';

import { useDocument } from '../hooks';
import { useRootStore } from '../RootStateContext';

import { db } from '../firebase';

export const Quiz = observer(() => {
  const { quizStore } = useRootStore();
  const [saving, setSaving] = useState(false);
  const { remove: removeDocument, loading: isRemoveInProgress } = useDocument(
    db,
    'quiz'
  );
  const [questions, loading] = useCollectionData(collection(db, 'quiz'), {
    idField: 'id',
  });

  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (questions?.length) {
      quizStore.addQuestions(questions as any);
    }
  }, [loading, questions, quizStore]);

  const isEditMode = Boolean(quizStore.question);

  const columns = [
    {
      title: 'Вопрос',
      dataIndex: 'text',
      key: 'text',
      render(text: string) {
        return <p>{text.length > 70 ? text.slice(0, 70).concat('...') : text}</p>
      }
    },
    {
      title: 'Это основной вопрос',
      dataIndex: 'isFirst',
      render(isFirst: boolean) {
        return isFirst ? 'Да' : 'Нет'
      }
    },
    {
      title: 'Ответы',
      dataIndex: 'answers',
      key: 'answers',
      render(arr: any[]) {
        return (
          <ul>
            {arr.map(({ text, next }: any, index: number) => (
              <li key={text + index}>
                {text} -&gt;{' '}
                {next === 'finish'
                  ? 'Завершение опроса'
                  : questions?.find(({ id }) => id === next)?.text}
              </li>
            ))}
          </ul>
        );
      },
    },
    {
      title: 'Действия',
      dataIndex: 'actions',
      render: (text: string, record: any) => (
        <div>
          <Button
            onClick={() => {
              handleEdit(record.id);
            }}
          >
            <EditOutlined />
          </Button>
          <Button
            onClick={() => {
              removeDocument(record.id);
            }}
          >
            <DeleteOutlined />
          </Button>
        </div>
      ),
    },
  ];

  const handleEdit = (id: string) => {
    quizStore.addQuestion(questions?.find(({ id: _id }) => _id === id) as any);
    setIsModalVisible(true);
  };

  const onFinish = async (values: any) => {
    try {
      setSaving(true);
      const id = isEditMode ? quizStore?.question?.id ?? '' : uuid();

      await setDoc(doc(db, 'quiz', id), values);
    } catch (e) {
      console.info(e);
    } finally {
      setSaving(false);
      setIsModalVisible(false);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    quizStore.addQuestion(undefined);
    setIsModalVisible(false);
  };

  const modalTitle = isEditMode ? 'Редактирование вопроса' : 'Новый вопрос';
  const okText = isEditMode ? 'сохранить' : 'создать';

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
            <Button key="primary" type="primary" onClick={showModal}>
              Добавить
              <PlusOutlined />
            </Button>,
          ]}
        />
        <Divider />

        <Table
          columns={columns}
          dataSource={questions}
          loading={loading || isRemoveInProgress}
        />
      </div>

      <Modal
        centered
        cancelText="отменить"
        destroyOnClose={true}
        title={modalTitle}
        okText={okText}
        visible={isModalVisible}
        onCancel={handleCancel}
        afterClose={handleCancel}
        okButtonProps={{
          form: 'myForm',
          htmlType: 'submit',
          disabled: saving,
        }}
      >
        <QuestionForm onFinish={onFinish} />
      </Modal>
    </>
  );
});
