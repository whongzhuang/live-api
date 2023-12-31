import React from "react";
import TextArea from "antd/es/input/TextArea";
import { Button, Col, Drawer, Form, Input, Row, Space, message } from 'antd';
import { Select } from 'antd';
import type { SelectProps } from 'antd';
import { Divider, Tag } from 'antd';
import { isjson } from '../utils'
import callurl from '../callurl'


const apitypes = [
    {
        value: 'POST',
        label: 'POST',
    }
];

const Post = (props?: { api_id?: string; }) => {
    const [open, setOpen] = React.useState(false);
    const [outjson, setoutjson] = React.useState('');
    const [apitype, setapitype] = React.useState('');
    const [url, seturl] = React.useState('');
    const [injson, setinjson] = React.useState('');
    const [desc, setdesc] = React.useState('0');
    const [options, setoptions] = React.useState<SelectProps['options']>([]);
    const [labels, setlabels] = React.useState<string[]>([]);
    const [labelnames, setlabelnames] = React.useState<string[]>([]);
    const handleChange = (value: string[]) => {
        console.log(`selected ${value}`);
        setlabels(value);
    };

    const onClose = () => {
        setOpen(false);
    };

    React.useEffect(() => {
        if (props?.api_id) {
            console.log(props.api_id);
            fetch(callurl.apiinfo + `/${props.api_id}`)
                .then((response) => response.json())
                .then((data) => {
                    console.log('Success:', data);
                    let url = data.api_info.url;
                    let injson = data.api_content.in_json;
                    let outjson = data.api_content.out_json;
                    let api_label_info = data.api_label_info;
                    api_label_info.forEach((element: any) => {
                        labelnames.push(element.label_name);
                    });
                    setlabelnames(labelnames);
                    seturl(url);
                    //json格式化
                    injson = JSON.stringify(JSON.parse(injson), null, 4);
                    outjson = JSON.stringify(JSON.parse(outjson), null, 4);
                    setinjson(injson);
                    setoutjson(outjson);
                    setlabels(labelnames);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    }, []);

    const showDrawer = () => {
        if (outjson === '') {
            message.error('出参报文不能为空！');
            return;
        }
        if (injson === '') {
            message.error('入参报文不能为空！');
            return;
        }
        if (url === '') {
            message.error('接口不能为空！');
            return;
        }
        setOpen(true);
        //apilabeldict
        fetch(callurl.apilabeldict, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Success:', data);
                let options: SelectProps['options'] = [];
                for (let i = 0; i < data.length; i++) {
                    options.push({
                        label: data[i].label_name,
                        value: data[i].label_name,
                    });
                }
                setoptions(options);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const postapi = () => {
        setoutjson('');
        if (url === '') {
            message.error('接口不能为空！');
            return;
        }
        if (injson === '') {
            message.error('入参不能为空！');
            return;
        }
        if (!isjson(injson)) {
            message.error('入参不是JSON格式！');
            return;
        }
        fetch(callurl.postapi, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: url,
                injson: injson,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Success:', data);
                let outjson = JSON.stringify(data, null, 4);
                setoutjson(outjson);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }


    const apichange = (e: any) => {
        seturl(e.target.value);
    }
    const injsonchange = (e: any) => {
        let targetvalue = e.target.value;
        setinjson(targetvalue);
    }
    const apitypeselect = (value: string) => {
        setapitype(value);
    }

    const insertdata = (values: any) => {
        if (url === '') {
            message.error('接口不能为空！');
            return;
        }
        if (injson === '') {
            message.error('入参不能为空！');
            return;
        }
        if (outjson === '') {
            message.error('出参不能为空！');
            return;
        }
        if (labels.length === 0) {
            message.error('标签不能为空！');
            return;
        }
        let body: any = { url: url, desc: desc, in_json: injson, out_json: outjson, labels: labels };
        if (props?.api_id) {
            body['api_id'] = props.api_id;
        }
        fetch(callurl.insertdata, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Success:', data);
                onClose();
                message.success('保存成功');
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }


    return (
        <div>
            <br />
            <Row>
                <Col span={12} offset={1}>
                    <div style={{ textAlign: "left", width: '100%' }}>
                        <Space direction="vertical" size="middle">
                            <Space.Compact>
                                <Select defaultValue="POST" options={apitypes} onSelect={apitypeselect} />
                                <Input onChange={apichange} placeholder="接口" value={url} style={{ textAlign: "left", width: '526px' }} />
                            </Space.Compact>
                        </Space>
                    </div>
                </Col>
                <Col span={3}>
                    <Space size={"middle"}>
                        <Button type="primary" onClick={postapi}>
                            运行
                        </Button>
                        <Button type="primary" onClick={() => {
                            showDrawer();
                        }}>保存</Button>
                    </Space>
                </Col>
            </Row>
            <br />
            <Row style={{ textAlign: "left", alignItems: "center" }}>
                <Col span={8} offset={1}>
                    <Space size={[0, 8]} wrap>
                        {
                            labelnames.map((item, index) => {
                                let colors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'cyan'];
                                let color = colors[Math.floor(Math.random() * colors.length)];
                                return (
                                    <Tag key={index} color={color}>{item}</Tag>
                                )
                            })
                        }
                    </Space>
                </Col>
            </Row>

            <br />
            <Row justify={"space-around"}>
                <Col span={10}>
                    <TextArea rows={40} placeholder={'入参报文'} onChange={injsonchange} value={injson}>
                    </TextArea>
                </Col>
                <Col span={10}>
                    <TextArea rows={40} value={outjson} placeholder={'出参报文'} readOnly={true}>
                    </TextArea>
                </Col>
            </Row>
            <Row>
                <br />
                <br />
                <br />
            </Row>
            <div>
                <Drawer
                    title="接口信息保存"
                    width={720}
                    onClose={onClose}
                    open={open}
                    bodyStyle={{ paddingBottom: 80 }}
                    extra={
                        <Space>
                            <Button onClick={onClose}>取消</Button>
                            <Button type="primary" onClick={insertdata}> {/* 设置提交类型 */}
                                保存
                            </Button>
                        </Space>
                    }
                >
                    <Form layout="vertical" hideRequiredMark>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="label"
                                    label="label:"
                                    rules={[{ required: true, message: '标签不能为空' }]}
                                >
                                    <Select
                                        mode="tags"
                                        placeholder="添加标签"
                                        defaultValue={labels}
                                        onChange={handleChange}
                                        style={{ width: '100%' }}
                                        options={options}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Drawer>
            </div>
        </div>
    )
}


export default Post;