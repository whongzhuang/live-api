
import React, { useRef, useState } from 'react';
import { Tabs, Tag } from 'antd';
import Post from './Post';
import { Button, Col, Drawer, Form, Input, Row, Space } from 'antd';
import { useMemo } from 'react';
import debounce from 'lodash/debounce';
import { Select, Spin } from 'antd';
import type { SelectProps } from 'antd/es/select';

export interface DebounceSelectProps<ValueType = any>
    extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
    fetchOptions: (search: string) => Promise<ValueType[]>;
    debounceTimeout?: number;
}

function DebounceSelect<
    ValueType extends { key?: string; label: React.ReactNode; value: string | number } = any,
>({ fetchOptions, debounceTimeout = 800, ...props }: DebounceSelectProps<ValueType>) {
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState<ValueType[]>([]);
    const fetchRef = useRef(0);

    const debounceFetcher = useMemo(() => {
        const loadOptions = (value: string) => {
            fetchRef.current += 1;
            const fetchId = fetchRef.current;
            setOptions([]);
            setFetching(true);

            fetchOptions(value).then((newOptions) => {
                if (fetchId !== fetchRef.current) {
                    // for fetch callback order
                    return;
                }

                setOptions(newOptions);
                setFetching(false);
            });
        };

        return debounce(loadOptions, debounceTimeout);
    }, [fetchOptions, debounceTimeout]);

    return (
        <Select
            labelInValue
            filterOption={false}
            onSearch={debounceFetcher}
            notFoundContent={fetching ? <Spin size="small" /> : null}
            {...props}
            options={options}
        />
    );
}

// Usage of DebounceSelect
interface UserValue {
    label: string;
    value: string;
}

async function fetchUserList(username: string): Promise<UserValue[]> {
    console.log('fetching user', username);

    return fetch(`http://localhost:5000/getApiByLike/?searchTerm=${username}`)
        .then((response) => response.json())
        .then((body) =>
            body?.map(
                (api: any) => ({
                    label: (
                        <div>
                            <Tag color="blue">{api.api_id}</Tag>
                            <Tag color="blue">{api.url}</Tag>
                            <Tag color="blue">{api.success_num}</Tag>
                            <Tag color="blue">{api.last_update_time}</Tag>
                        </div>),
                    value: api.api_id,
                }),
            ),
        );
}

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
    const [value, setValue] = useState<UserValue[]>([]);
    const [oldvalues, setoldvalues] = useState<string[]>([]);

    const onChange = (newActiveKey: string) => {
        setActiveKey(newActiveKey);
    };

    const add = (newValue?: UserValue | UserValue[]) => {
        if (newValue !== undefined && Array.isArray(newValue) && newValue.length > 0) {
            for (let i = 0; i < newValue.length; i++) {
                let value = newValue[i].value;
                const newActiveKey = `old${value}`;
                console.log('value::::::::::' + 'old'.concat(value));
                if (oldvalues.includes('old'.concat(value))) {
                    continue;
                } else {
                    oldvalues.push('old'.concat(value));
                }
                setoldvalues(oldvalues);
                const newPanes = [...items];
                newPanes.push({ label: 'New Tab', children: <Post api_id={value} />, key: newActiveKey });
                console.log('newpanes' + newPanes);
                setItems(newPanes);
                setActiveKey(newActiveKey);
            }
        } else {
            const newActiveKey = `newTab${newTabIndex.current++}`;
            const newPanes = [...items];
            newPanes.push({ label: 'New Tab', children: <Post />, key: newActiveKey });
            setItems(newPanes);
            setActiveKey(newActiveKey);
        }
    };

    const remove = (targetKey: TargetKey) => {
        console.log('remove' + targetKey);
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
            <Row>
                <Col span={15} offset={4}>
                    <DebounceSelect
                        mode="multiple"
                        value={value}
                        placeholder="接口查询"
                        fetchOptions={fetchUserList}
                        onChange={(newValue) => {
                            console.log('onChange', newValue);
                            add(newValue)

                            let newkeys: string[] = Array.isArray(newValue) ? newValue.map((item) => 'old'.concat(item.value)) : [];
                            let notinold: string[] = oldvalues.filter((item) => !newkeys.includes(item));
                            console.log('notinold' + notinold);
                            if (notinold.length > 0) {
                                //remove(notinold[0]) from oldvalues
                                setoldvalues(oldvalues.filter((item) => !notinold.includes(item)));
                                remove(notinold[0])
                            }
                            setValue(newValue as UserValue[]);
                        }}
                        style={{ width: '100%' }}
                    />
                </Col>
            </Row>
            <br />
            <br />
            <Row>
                <Col span={20} offset={2}>
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
                </Col>
            </Row>
        </div>
    )
}


export default PostTab;