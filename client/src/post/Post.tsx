import React from "react";
import TextArea from "antd/es/input/TextArea";
import { Button, Col, Drawer, Form, Input, Row, Space, message } from 'antd';
import { Select } from 'antd';
import type { SelectProps } from 'antd';
import { Divider, Tag } from 'antd';
import { isjson } from '../utils'

const Post = (props?: { api_id?: string; }) => {
    const [open, setOpen] = React.useState(false);
    const [outjson, setoutjson] = React.useState('');
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
            fetch(`http://localhost:5000/apiinfo/${props.api_id}`)
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
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    }, []);

    const showDrawer = () => {
        //if outjson is empty,message.error('output json is empty'); then return;
        if (outjson === '') {
            message.error('output json is empty');
            return;
        }
        //if injson is empty,message.error('input json is empty'); then return;
        if (injson === '') {
            message.error('input json is empty');
            return;
        }
        //if url is empty,message.error('api name is empty'); then return;
        if (url === '') {
            message.error('api name is empty');
            return;
        }
        setOpen(true);
        //getlabeldict
        fetch('http://localhost:5000/getlabeldict', {
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
            message.error('api name is empty');
            return;
        }
        if (injson === '') {
            message.error('input json is empty');
            return;
        }
        if (!isjson(injson)) {
            message.error('input json is not valid');
            return;
        }

        //A POST request with JSON data
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: injson,
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Success:', data);
                //json格式化
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
        //json格式化
        let targetvalue = e.target.value;
        setinjson(targetvalue);
    }

    const insertdata = (values: any) => {
        if (url === '') {
            message.error('api name is empty');
            return;
        }
        if (injson === '') {
            message.error('input json is empty');
            return;
        }
        if (outjson === '') {
            message.error('output json is empty');
            return;
        }
        if (labels.length === 0) {
            message.error('label is empty');
            return;
        }
        fetch('http://localhost:5000/insertdata', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url, desc: desc, in_json: injson, out_json: outjson, labels: labels }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Success:', data);
                setoutjson(JSON.stringify(data));
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }


    return (
        <div>
            <br />
            <Row>
                <Col span={8} offset={1}>
                    <Input onChange={apichange} placeholder="input api" value={url} />
                </Col>
                <Col span={3}>
                    <Space size={"middle"}>
                        <Button type="primary" onClick={postapi}>
                            run
                        </Button>
                        <Button type="primary" onClick={() => {
                            showDrawer();
                        }}>save</Button>
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
                <Col span={5} push={4}>
                    <div>
                        <p style={{ color: 'red' }}>调用时间：300ms，主机1.1.1.1</p>
                    </div>
                </Col>
            </Row>

            <br />
            <Row justify={"space-around"}>
                <Col span={10}>
                    <TextArea rows={40} placeholder={'content'} onChange={injsonchange} value={injson}>
                    </TextArea>
                </Col>
                <Col span={10}>
                    <TextArea rows={40} value={outjson} placeholder={'return'}>
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
                    title="Save a Api"
                    width={720}
                    onClose={onClose}
                    open={open}
                    bodyStyle={{ paddingBottom: 80 }}
                    extra={
                        <Space>
                            <Button onClick={onClose}>Cancel</Button>
                            <Button type="primary" onClick={insertdata}> {/* 设置提交类型 */}
                                Submit
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
                                    rules={[{ required: true, message: 'Please enter api desc' }]}
                                >
                                    <Select
                                        mode="tags"
                                        placeholder="Please select"
                                        defaultValue={[]}
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