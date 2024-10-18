import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, DatePicker, InputNumber, Select, Upload, Button, Row, Col, Typography, message } from 'antd';
import { BarcodeOutlined, CalendarOutlined, ShoppingOutlined, TagOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import useProducts from '../../../utils/productUtils';

const { Option } = Select;
const { Title } = Typography;

const ProductForm = ({ visible, onCancel, catalogs, factories, initialValues = null, onSuccess }) => {
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState('');
    const [fileList, setFileList] = useState([]);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const { createProduct, updateProduct , fetchProducts} = useProducts();

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue({
                ...initialValues,
                production_date: initialValues.production_date ? moment(initialValues.production_date) : null,
                expiration_date: initialValues.expiration_date ? moment(initialValues.expiration_date) : null,
            });
            setImageUrl(initialValues.image || '');
            setFileList(initialValues.image ? [{ uid: '-1', name: 'image.png', status: 'done', url: initialValues.image }] : []);
        } else {
            form.resetFields();
            setImageUrl('');
            setFileList([]);
        }
    }, [initialValues, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            
            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    if (key === 'production_date' || key === 'expiration_date') {
                        formData.append(key, value.format('YYYY-MM-DD'));
                    } else {
                        formData.append(key, value);
                    }
                }
            });
            
            if (image) {
                formData.append('image', image);
            } else if (imageUrl) {
                // If there's an existing image URL but no new image uploaded
                formData.append('image', imageUrl);
            }
            
            let response;
            if (initialValues) {
                response = await updateProduct(initialValues.id, formData);
            } else {
                response = await createProduct(formData);
            }
            
            if (response.success) {
                message.success(initialValues ? 'Sản phẩm đã được cập nhật thành công.' : 'Sản phẩm đã được thêm thành công.');
                fetchProducts();
                if (onSuccess) onSuccess(response.data);
                onCancel();
            } else {
                message.error(response.message || 'Đã xảy ra lỗi.');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleImageChange = (info) => {
        const file = info.file.originFileObj;
        setImage(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
        setFileList(info.fileList);
    };

    const handleRemove = () => {
        setImageUrl('');
        setFileList([]);
        setImage(null);
        setImagePreview(null);
    };

    const beforeUpload = (file) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('Hình ảnh phải là một tệp ảnh.');
        }
        const isValidFormat = ['image/jpeg', 'image/png', 'image/gif'].includes(file.type);
        if (!isValidFormat) {
            message.error('Hình ảnh phải có định dạng jpeg, png, gif.');
        }
        return isImage && isValidFormat;
    };

    return (
        <Modal
            title={<Title level={3}>{initialValues ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</Title>}
            visible={visible}
            onCancel={onCancel}
            onOk={handleSubmit}
            width={800}
            okText="Lưu"
            cancelText="Hủy"
        >
            <Form form={form} layout="vertical">
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="product_name"
                            label="Tên sản phẩm"
                            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
                        >
                            <Input prefix={<TagOutlined />} placeholder="Nhập tên sản phẩm" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="barcode"
                            label="Mã vạch"
                            rules={[{ required: true, message: 'Vui lòng nhập mã vạch' }]}
                        >
                            <Input prefix={<BarcodeOutlined />} placeholder="Nhập mã vạch" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="production_date"
                            label="Ngày sản xuất"
                            rules={[{ required: true, message: 'Vui lòng chọn ngày sản xuất' }]}
                        >
                            <DatePicker style={{ width: '100%' }} prefix={<CalendarOutlined />} format="DD/MM/YYYY" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="expiration_date"
                            label="Ngày hết hạn"
                            rules={[{ required: true, message: 'Vui lòng chọn ngày hết hạn' }]}
                        >
                            <DatePicker style={{ width: '100%' }} prefix={<CalendarOutlined />} format="DD/MM/YYYY" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            name="quantity"
                            label="Số lượng"
                            rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
                        >
                            <InputNumber style={{ width: '100%' }} min={0} prefix={<ShoppingOutlined />} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="selling_price"
                            label="Giá bán"
                            rules={[{ required: true, message: 'Vui lòng nhập giá bán' }]}
                        >
                            <InputNumber style={{ width: '100%' }} min={0} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="purchase_price"
                            label="Giá mua vào"
                            rules={[{ required: true, message: 'Vui lòng nhập giá mua vào' }]}
                        >
                            <InputNumber style={{ width: '100%' }} min={0}  />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="catalogy_id"
                            label="Danh mục"
                            rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
                        >
                            <Select placeholder="Chọn danh mục">
                                {catalogs.map(catalog => (
                                    <Option key={catalog.id} value={catalog.id}>{catalog.catalogy_name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="factory_id"
                            label="Nhà máy sản xuất"
                            rules={[{ required: true, message: 'Vui lòng chọn nhà máy sản xuất' }]}
                        >
                            <Select placeholder="Chọn nhà máy sản xuất">
                                {factories.map(factory => (
                                    <Option key={factory.id} value={factory.id}>{factory.factory_name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="image"
                    label="Hình ảnh sản phẩm"
                    rules={[{ required: true, message: 'Vui lòng tải lên hình ảnh sản phẩm' }]}
                >
                    <Upload
                        name="image"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={true}
                        onChange={handleImageChange}
                        fileList={fileList}
                        onRemove={handleRemove}
                        beforeUpload={beforeUpload}
                    >
                        {fileList.length >= 1 ? null : (
                            <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Tải lên</div>
                            </div>
                        )}
                    </Upload>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ProductForm;
