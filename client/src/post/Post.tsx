import React from "react";
import TextArea from "antd/es/input/TextArea";
import { Button, Col, Drawer, Form, Input, Row, Space, message } from 'antd';

const Post = () => {
    const [open, setOpen] = React.useState(false);
    const [outtxt, setouttxt] = React.useState('');
    const [url, seturl] = React.useState('');
    const [injson, setinjson] = React.useState('');
    const [desc, setdesc] = React.useState('');


    const onClose = () => {
        setOpen(false);
    };

    const showDrawer = () => {
        setOpen(true);
    };

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
        let body = {}

        fetch('http://localhost:5000/insertdata', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: injson,
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
    const apichange = (e: any) => {
        seturl(e.target.value);
    }
    const injsonchange = (e: any) => {
        setinjson(e.target.value);
    }

    const insertdata = () => {
        fetch('http://localhost:5000/insertdata', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url, desc: desc, in_json: injson, out_json: outtxt }),
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
                    <Input onChange={apichange} />
                </Col>
                <Col span={5}>
                    <Space size={"middle"}>
                        <Button type="primary" onClick={postapi}>
                            run
                        </Button>
                        <Button onClick={() => {
                            showDrawer();
                        }}>save</Button>
                    </Space>
                </Col>
            </Row>
            <br />

            <br />
            <Row justify={"space-around"}>
                <Col span={10}>
                    <TextArea rows={30} placeholder={'content'} onChange={injsonchange}>
                    </TextArea>
                </Col>
                <Col span={10}>
                    <TextArea rows={30} value={outtxt} placeholder={'return'}>
                    </TextArea>
                </Col>
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
                            <Button onClick={insertdata} type="primary">
                                Submit
                            </Button>
                        </Space>
                    }
                >
                    <Form layout="vertical" hideRequiredMark>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="desc"
                                    label="desc:"
                                    rules={[{ required: true, message: 'Please enter api desc' }]}
                                >
                                    <Input placeholder="Please enter api desc" />
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