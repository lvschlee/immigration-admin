import { Menu as AntMenu } from 'antd';
import { Link } from 'react-router-dom';

import {
  BookOutlined,
  AlertOutlined,
  NotificationOutlined,
} from '@ant-design/icons';


export function Menu() {
  return (
    <AntMenu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
      <AntMenu.Item key="1" icon={<AlertOutlined />}>
        <Link to="/">Заявки</Link>
      </AntMenu.Item>
      <AntMenu.Item key="2" icon={<BookOutlined />}>
        <Link to="posts">Записи</Link>
      </AntMenu.Item>
      <AntMenu.Item key="3" icon={<NotificationOutlined />}>
        <Link to="quiz">Опросник</Link>
      </AntMenu.Item>
    </AntMenu>
  );
}
