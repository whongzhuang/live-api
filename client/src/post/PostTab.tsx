
import React, { useRef, useState } from 'react';
import { Input, Tabs } from 'antd';
import Post from './Post';

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

const initialItems = [
    {
        label: 'Tab 1', children: <Post />, key: '1'
    },
    { label: 'Tab 2', children: <Post />, key: '2' },
    { label: 'Tab 3', children: <Post />, key: '3' },
];

const PostTab = () => {
    const [activeKey, setActiveKey] = useState(initialItems[0].key);
    const [items, setItems] = useState(initialItems);
    const newTabIndex = useRef(0);

    const onChange = (newActiveKey: string) => {
        setActiveKey(newActiveKey);
    };

    const add = () => {
        const newActiveKey = `newTab${newTabIndex.current++}`;
        const newPanes = [...items];
        newPanes.push({ label: 'New Tab', children: <Post />, key: newActiveKey });
        setItems(newPanes);
        setActiveKey(newActiveKey);
    };

    const remove = (targetKey: TargetKey) => {
        let newActiveKey = activeKey;
        let lastIndex = -1;
        items.forEach((item, i) => {
            if (item.key === targetKey) {
                lastIndex = i - 1;
            }
        });
        const newPanes = items.filter((item) => item.key !== targetKey);
        if (newPanes.length && newActiveKey === targetKey) {
            if (lastIndex >= 0) {
                newActiveKey = newPanes[lastIndex].key;
            } else {
                newActiveKey = newPanes[0].key;
            }
        }
        setItems(newPanes);
        setActiveKey(newActiveKey);
    };

    const onEdit = (
        targetKey: React.MouseEvent | React.KeyboardEvent | string,
        action: 'add' | 'remove',
    ) => {
        if (action === 'add') {
            add();
        } else {
            remove(targetKey);
        }
    };

    return (
        <div>
            <Input placeholder='search api'></Input>
            <br />
            <br />
            <Tabs
                type="editable-card"
                onChange={onChange}
                activeKey={activeKey}
                onEdit={onEdit}>
                {items.map((item) => (
                    <Tabs.TabPane tab={item.label} key={item.key}>
                        {item.children}
                    </Tabs.TabPane>
                ))}
            </Tabs>
        </div>
    )
}


export default PostTab;