import { v4 as uuid } from 'uuid';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { collection, doc, setDoc } from 'firebase/firestore';
import {
  Button,
  Divider,
  PageHeader,
  Form,
  Input,
} from 'antd';


import { db } from '../firebase';

export function Quiz() {
  const [quiz, loading] = useCollectionData(collection(db, 'quiz'), {
    idField: 'id',
  });

  const onFinish = async (values: any) => {
    await setDoc(doc(db, 'quiz', uuid()), values);
  };

  console.info(quiz);

  if (loading) {
    return <p>loading</p>;
  }

  return (
    <div>
      <PageHeader
        ghost={false}
        onBack={() => window.history.back()}
        title="Опросник"
      />
      <Divider />

      <div>
        <Form
          name="basic"
          id="myForm"
          initialValues={{ remember: true }}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="description"
            rules={[{ required: true, message: 'Поле не может быть пустым' }]}
          >
            <Input.TextArea autoSize={{ minRows: 20 }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary">Сохранить</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
