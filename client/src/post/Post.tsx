import React from "react";
import TextArea from "antd/es/input/TextArea";
import { Button, Col, Drawer, Form, Input, Row, Space, message } from 'antd';
import { Select } from 'antd';
import type { SelectProps } from 'antd';
import { Divider, Tag } from 'antd';


const handleChange = (value: string[]) => {
    console.log(`selected ${value}`);
};
const Post = () => {
    const [open, setOpen] = React.useState(false);
    const [outtxt, setouttxt] = React.useState('');
    const [url, seturl] = React.useState('');
    const [injson, setinjson] = React.useState('');
    const [desc, setdesc] = React.useState('0');
    const [options, setoptions] = React.useState<SelectProps['options']>([]);
    const [labels, setlabels] = React.useState<string[]>([]);
    const handleChange = (value: string[]) => {
        console.log(`selected ${value}`);
        setlabels(value);
    };

    const onClose = () => {
        setOpen(false);
    };

    const showDrawer = () => {
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
    const descchange = (e: any) => {
        setdesc(e.target.value);
    }

    const postapi = () => {
        setouttxt('');
        if (url === '') {
            message.error('api name is empty');
            return;
        }
        if (injson === '') {
            message.error('input json is empty');
            return;
        }
        setouttxt('loading...');
    }
    const apichange = (e: any) => {
        seturl(e.target.value);
    }
    const injsonchange = (e: any) => {
        setinjson(e.target.value);
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
        if (desc === '') {
            message.error('desc is empty');
            return;
        }
        if (outtxt === '') {
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
            body: JSON.stringify({ url: url, desc: desc, in_json: injson, out_json: outtxt, labels: labels }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Success:', data);
                setouttxt(JSON.stringify(data));
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
                    <Input onChange={apichange} placeholder="input api" />
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
            <Row style={{ textAlign: "left",alignItems:"center" }}>
                <Col span={8} offset={1}>
                    <Space size={[0, 8]} wrap>
                        <Tag color="magenta">magenta</Tag>
                        <Tag color="red">red</Tag>
                        <Tag color="volcano">volcano</Tag>
                        <Tag color="orange">orange</Tag>
                        <Tag color="gold">gold</Tag>
                        <Tag color="lime">lime</Tag>
                        <Tag color="green">green</Tag>
                        <Tag color="cyan">cyan</Tag>
                        <Tag color="cyan">cyan</Tag>
                    </Space>
                </Col>
                <Col span={5} push={4}>
                    <div>
                        <p style={{color:'red'}}>调用时间：300ms，主机1.1.1.1</p>
                    </div>
                </Col>
            </Row>

            <br />
            <Row justify={"space-around"}>
                <Col span={10}>
                    <TextArea rows={40} placeholder={'content'} onChange={injsonchange}>
                    </TextArea>
                </Col>
                <Col span={10}>
                    <TextArea rows={40} value={outtxt} placeholder={'return'}>
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
                        {/* <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="desc"
                                    label="desc:"
                                    rules={[{ required: true, message: 'Please enter api desc' }]}
                                >
                                    <Input placeholder="Please enter api desc" onChange={descchange} />
                                </Form.Item>
                            </Col>
                        </Row> */}
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