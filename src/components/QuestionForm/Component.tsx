import { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Checkbox, Divider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Observer } from 'mobx-react';

import { useRootStore } from '../../RootStateContext';

export const QuestionForm = ({ onFinish }: any) => {
  const [isFirst, setIsFirst] = useState(false);
  const { quizStore } = useRootStore();
  const { question, questions } = quizStore;
  const questionsWithoutCurrent = questions.filter(
    ({ id, isFirst }) => id !== question?.id && !isFirst
  );

  const handleSubmit = (values: any) => {
    onFinish({
      ...values,
      isFirst,
    });
  };

  useEffect(() => {
    if (question) {
      setIsFirst(question.isFirst);
    }
  }, [question])

  return (
    <Observer>
      {() => (
        <Form
          name="basic"
          id="myForm"
          initialValues={{
            remember: true,
            text: question?.text,
            answers: question?.answers || [],
          }}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="Вопрос"
            name="text"
            rules={[{ required: true, message: 'Поле не может быть пустым' }]}
          >
            <Input />
          </Form.Item>
          <label htmlFor="">Ответы</label>
          <Divider />
          <Form.List initialValue={question?.answers} name="answers">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <div key={key}>
                    <Form.Item
                      {...restField}
                      label="Текст"
                      name={[name, 'text']}
                      fieldKey={[fieldKey, 'text']}
                      rules={[
                        {
                          required: true,
                          message: 'Ответ неможет быть пустым',
                        },
                      ]}
                    >
                      <Input.TextArea placeholder="какой то текст" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      label="Следующий вопрос"
                      name={[name, 'next']}
                      fieldKey={[fieldKey, 'next']}
                      initialValue="finish"
                    >
                      <Select>
                        <Select.Option value="finish">
                          Это последний вопрос
                        </Select.Option>
                        {questionsWithoutCurrent.map(({ id, text }) => (
                          <Select.Option key="id" value={id}>
                            {text}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Button onClick={() => remove(name)}>Удалить ответ</Button>
                    <Divider />
                  </div>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Добавить
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Divider />
          <Form.Item
            colon={true}
            label="Данный вопрос является основным (с него начнется опрос):"
            name="isFirst"
          >
            <Checkbox
              checked={isFirst}
              onChange={({ target }: any) => {
                setIsFirst(target.checked);
              }}
            />
          </Form.Item>
        </Form>
      )}
    </Observer>
  );
};
