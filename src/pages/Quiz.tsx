import { useState } from 'react';
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
  const [saving, setSaving] = useState(false);
  const [quiz = [], loading] = useCollectionData<any, any, any>(collection(db, 'quiz'), {
    idField: 'id',
  });

  const onFinish = async (values: any) => {
    try {
      setSaving(true);

      await setDoc(doc(db, 'quiz', 'main'), values);
    } catch(e) {
      console.info(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p>loading</p>;
  }

  const { schema } = quiz[0];

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
          initialValues={{ remember: true, schema }}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="schema"
            rules={[{ required: true, message: 'Поле не может быть пустым' }]}
          >
            <Input.TextArea autoSize={{ minRows: 20 }} />
          </Form.Item>
          <Form.Item>
            <Button loading={saving} htmlType="submit" type="primary">Сохранить</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
