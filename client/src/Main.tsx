import React, { useState } from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import PostTab from './post/PostTab';
import Mock from './mock/Mock';
import Manage from './manage/Manage';
import Settings from './settting/Settings';

const items: MenuProps['items'] = [
    {
        label: 'postapi',
        key: 'postapi',
        icon: <MailOutlined />,
    },
    {
        label: 'mock',
        key: 'mock',
        icon: <AppstoreOutlined />,
    },
    {
        label: 'manage',
        key: 'manage',
        icon: <AppstoreOutlined />,
    },
    {
        label: 'settings',
        key: 'settings',
        icon: <AppstoreOutlined />,
    },
];

const App: React.FC = () => {
    const [current, setCurrent] = useState('postapi');

    const onClick: MenuProps['onClick'] = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
            </div>
            <br />
            <br />
            {
                current === 'postapi' ? <PostTab /> : null
            }
            {
                current === 'mock' ? <Mock /> : null
            }
            {
                current === 'manage' ? <Manage /> : null
            }
            {
                current === 'settings' ? <Settings /> : null
            }
        </div>
    );
};

export default App;