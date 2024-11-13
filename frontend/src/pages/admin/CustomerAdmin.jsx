import { Layout, Typography, Table, Card, Space, Statistic, Row, Col, Modal, List, Tag } from 'antd';
import customerService from '../../services/customer.service';
import { useEffect, useState } from 'react';
import { handleResponse } from '../../functions';
import { UserOutlined, StarOutlined, PhoneOutlined, ShoppingOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title } = Typography;

export default function CustomerAdmin() {
    
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [infoBuy, setInfoBuy] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const fetchInfoBuy = async (id) => {
        
        try {
            const response = await customerService.getInfoBuy(id);
            const data = handleResponse(response);
            console.log(data);
            setInfoBuy(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchCustomers = async () => {
        try {
            const response = await customerService.getAll();
            const data = handleResponse(response);
            setCustomers(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleRowClick = (record) => {
        setSelectedCustomer(record);
        fetchInfoBuy(record.id);
        setIsModalVisible(true);
    };

    const formatPhoneNumber = (phone) => {
        if (!phone) return '';
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 10) {
            return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
        }
        return phone;
    };

    const columns = [
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
            render: (text) => (
                <Space>
                    <UserOutlined />
                    {text}
                </Space>
            )
        },
        {
            title: 'Số điện thoại', 
            dataIndex: 'phone',
            key: 'phone',
            render: (text) => (
                <Space>
                    <PhoneOutlined />
                    {formatPhoneNumber(text)}
                </Space>
            )
        },
        {
            title: 'Điểm',
            dataIndex: 'diem',
            key: 'diem',
            sorter: (a, b) => a.diem - b.diem,
            defaultSortOrder: 'descend',
            render: (text) => (
                <Space>
                    <StarOutlined style={{ color: '#faad14' }}/>
                    {text}
                </Space>
            )
        },
        {
            title: 'Tài khoản',
            dataIndex: 'password',
            key: 'password',
            render: (text) => (
                text ? (
                    <Tag color="success" icon={<CheckCircleOutlined />}>
                        Đã đăng ký
                    </Tag>
                ) : null
            )
        }
    ];

    const totalPoints = customers.reduce((sum, customer) => sum + customer.diem, 0);
    const avgPoints = customers.length ? (totalPoints / customers.length).toFixed(1) : 0;

    return (
        <Layout>
            <Content style={{ padding: '24px', background: '#f0f2f5' }}>
                <Title level={2} style={{ marginBottom: '24px' }}>
                    <UserOutlined /> Quản lý khách hàng
                </Title>

                <Row gutter={16} style={{ marginBottom: '24px' }}>
                    <Col span={8}>
                        <Card>
                            <Statistic 
                                title="Tổng số khách hàng"
                                value={customers.length}
                                prefix={<UserOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card>
                            <Statistic 
                                title="Tổng điểm tích lũy"
                                value={totalPoints}
                                prefix={<StarOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card>
                            <Statistic 
                                title="Điểm trung bình"
                                value={avgPoints}
                                prefix={<StarOutlined />}
                            />
                        </Card>
                    </Col>
                </Row>

                <Card>
                    <Table 
                        columns={columns} 
                        dataSource={customers}
                        rowKey="id"
                        onRow={(record) => ({
                            onClick: () => handleRowClick(record)
                        })}
                        style={{ cursor: 'pointer' }}
                        pagination={{
                            pageSize: 10,
                            showTotal: (total) => `Tổng ${total} khách hàng`,
                            showSizeChanger: true,
                            showQuickJumper: true
                        }}
                    />
                </Card>

                <Modal
                    title={<Space><UserOutlined /> Chi tiết khách hàng</Space>}
                    open={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    width={800}
                    footer={null}
                >
                    {selectedCustomer && infoBuy && (
                        <>
                            <Card style={{ marginBottom: 16 }}>
                                <Row gutter={16}>
                                    <Col span={8}>
                                        <Statistic 
                                            title="Tên khách hàng"
                                            value={selectedCustomer.name}
                                            prefix={<UserOutlined />}
                                        />
                                    </Col>
                                    <Col span={8}>
                                        <Statistic 
                                            title="Số điện thoại"
                                            value={formatPhoneNumber(selectedCustomer.phone)}
                                            prefix={<PhoneOutlined />}
                                        />
                                    </Col>
                                    <Col span={8}>
                                        <Statistic 
                                            title="Tổng số đơn hàng"
                                            value={infoBuy.total_orders}
                                            prefix={<ShoppingOutlined />}
                                        />
                                    </Col>
                                </Row>
                            </Card>

                            <Card title="Top 5 sản phẩm mua nhiều nhất">
                                <List
                                    dataSource={infoBuy.top_products}
                                    renderItem={item => (
                                        <List.Item>
                                            <Row style={{ width: '100%' }} align="middle">
                                                <Col span={4}>
                                                    <img 
                                                        src={item.image} 
                                                        alt={item.name}
                                                        style={{ 
                                                            width: '100%',
                                                            height: '60px',
                                                            objectFit: 'cover'
                                                        }}
                                                    />
                                                </Col>
                                                <Col span={12}>
                                                    <Space direction="vertical" size="small">
                                                        <span style={{ fontWeight: 'bold' }}>{item.name}</span>
                                                        <span style={{ color: '#666' }}>Mã: {item.barcode}</span>
                                                    </Space>
                                                </Col>
                                                <Col span={8} style={{ textAlign: 'right' }}>
                                                    <Space>
                                                        <Tag color="blue">Số lượng: {item.quantity}</Tag>
                                                        <Tag color="green">
                                                            {(item.selling_price || 0).toLocaleString('vi-VN')}đ
                                                        </Tag>
                                                    </Space>
                                                </Col>
                                            </Row>
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        </>
                    )}
                </Modal>
            </Content>
        </Layout>
    );
}