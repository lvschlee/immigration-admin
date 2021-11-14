import { Menu as AntMenu } from 'antd';

import {
  DashboardOutlined,
  AuditOutlined,
  ContainerOutlined,
} from '@ant-design/icons';


export function Menu() {
  return (
    <AntMenu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
      <AntMenu.Item key="1" icon={<DashboardOutlined />}>
        Главная
      </AntMenu.Item>
      <AntMenu.Item key="2" icon={<AuditOutlined />}>
        Заявки
      </AntMenu.Item>
      <AntMenu.Item key="3" icon={<ContainerOutlined />}>
        Посты
      </AntMenu.Item>
    </AntMenu>
  );
}
