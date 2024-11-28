import { useRef, useEffect } from "react";
import { Link } from "react-router-dom"
import { useStateContext } from '../context/contextprovider'
import authService from "../services/auth.service";
import { handleToken } from "../functions";
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

export default function login() {
    const [form] = Form.useForm();

    const { setUser, setToken } = useStateContext();

    const Submit = async (values) => {
        try {
            const response = await authService.login(values);
            const cleanJsonString = response.replace(/^[^[{]*([\[{])/, '$1').replace(/([\]}])[^}\]]*$/, '$1');
            const data = JSON.parse(cleanJsonString);
            const token = handleToken(data.token);

            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('ACCESS_TOKEN', token);
            
            setUser(data.user);
            setToken(token);
            message.success('Đăng nhập thành công!');
        } catch (err) {
            console.log(err);
            message.error('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!');
        }
    }

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #1890ff 0%, #69c0ff 100%)'
        }}>
            <Card
                style={{
                    width: 400,
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    borderRadius: '10px'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <h1 style={{ 
                        fontSize: '24px',
                        color: '#1890ff',
                        marginBottom: '20px'
                    }}>
                        Đăng nhập
                    </h1>
                </div>

                <Form
                    form={form}
                    name="login"
                    onFinish={Submit}
                    layout="vertical"
                >
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email!' },
                            { type: 'email', message: 'Email không hợp lệ!' }
                        ]}
                    >
                        <Input 
                            prefix={<UserOutlined />}
                            placeholder="Email"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Mật khẩu"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            block
                            style={{
                                height: '40px',
                                borderRadius: '6px'
                            }}
                        >
                            Đăng nhập
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}
