import React from "react";
import TextArea from "antd/es/input/TextArea";
import { Button, Col, Drawer, Form, Input, Row, Space } from 'antd';

const Post = () => {
    const [open, setOpen] = React.useState(false);
    const [outtxt, setouttxt] = React.useState('');


    const onClose = () => {
        setOpen(false);
    };

    const onFinish = async (values: any) => {
        var svc_name = values.svc_name;
        var intxt = values.intxt;
        setouttxt(`{
    "call_type": "${svc_name}",
        }`);
    };

    const onFinishFailed = () => {
    }
    const showDrawer = () => {
        setOpen(true);
    };

    return (
        <div>
            <Form
                validateTrigger={'onBlur'}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                name="basic"
                labelCol={{
                    span: 3,
                }}
                wrapperCol={{
                    span: 13,
                }}
                initialValues={{
                    remember: true,
                    call_type: 'HSF',
                }}
                autoComplete="off"
            >
                <Row>
                    <Col span={12}>
                        <Form.Item
                            label="svc-name"
                            name="svc_name"
                            rules={[
                                {
                                    required: true,
                                    message: 'can not empty',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={1}>
                        <Form.Item
                        >
                            <Button type="primary" htmlType="submit">
                                run
                            </Button>
                        </Form.Item>
                    </Col>
                    <Col span={1}>
                        <Form.Item
                        >
                            <Button onClick={() => {
                                showDrawer();
                            }}>save</Button>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={10}>
                        <Form.Item
                            style={{ width: 1100 }}
                            name='intxt'
                            rules={[
                                {
                                    required: true,
                                    message: 'can not empty',
                                },
                            ]}>
                            <TextArea rows={30} placeholder={'content'}>
                            </TextArea>
                        </Form.Item>
                    </Col>
                    <Col span={10}>
                        <Form.Item style={{ width: 1100 }}>
                            <TextArea rows={30} value={outtxt} placeholder={'return'}>
                            </TextArea>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
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
                            <Button onClick={onClose} type="primary">
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