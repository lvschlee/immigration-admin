import { Menu as AntMenu } from 'antd';
import { Link } from 'react-router-dom';

import {
  AuditOutlined,
  ContainerOutlined,
} from '@ant-design/icons';


export function Menu() {
  return (
    <AntMenu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
      <AntMenu.Item key="1" icon={<AuditOutlined />}>
        <Link to="orders">Заявки</Link>
      </AntMenu.Item>
      <AntMenu.Item key="2" icon={<ContainerOutlined />}>
        <Link to="posts">Посты</Link>
      </AntMenu.Item>
    </AntMenu>
  );
}
