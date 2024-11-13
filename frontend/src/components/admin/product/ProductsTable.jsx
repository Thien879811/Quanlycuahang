import React, { useState, useEffect } from 'react';
import { Table, Tag, Modal, Button, Form, Image, Popconfirm, Input, Card, Space } from 'antd';
import { Typography, Box, Divider, Grid, Paper } from '@mui/material';
import useProducts from "../../../utils/productUtils"
import moment from 'moment';
import ProductForm from '../../../pages/admin/products/productForm';
import useCatalogs from '../../../utils/catalogUtils';
import useFactories from '../../../utils/factoryUtils';
import { EditOutlined, DeleteOutlined, CloseOutlined } from '@ant-design/icons';

const ProductsTable = () => {
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const {products, updateProduct, deleteProduct} = useProducts();
  const {catalogs} = useCatalogs();
  const {factories} = useFactories();

  const showModal = (product) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const showEditModal = () => {
    setIsModalVisible(false);
    setIsEditModalVisible(true);
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
  };

  const handleEditSubmit = (values) => {
    updateProduct(selectedProduct.id, values);
    setIsEditModalVisible(false);
    setIsModalVisible(true);
  };

  const handleDelete = async () => {
    Modal.confirm({
      title: 'Xác nhận xóa sản phẩm',
      content: `Bạn có chắc chắn muốn xóa sản phẩm "${selectedProduct.product_name}"? Hành động này không thể hoàn tác.`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        await deleteProduct(selectedProduct.id);
        setIsModalVisible(false);
      }
    });
  };

  const formatDate = (date) => {
    return moment(date).format('DD/MM/YYYY');
  };

  const handleSearch = (value) => {
    setLoading(true);
    
    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout
    const timeout = setTimeout(() => {
      setSearchText(value);
      setLoading(false);
    }, 500);

    setSearchTimeout(timeout);
  };

  const filteredProducts = products.filter(product => 
    product.product_name.toLowerCase().includes(searchText.toLowerCase()) ||
    product.barcode?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'product_name',
      key: 'product_name',
      render: (text, record) => (
        <Space>
          <Image
            src={record.image}
            alt={text}
            width={50}
            height={50}
            style={{ objectFit: 'cover', borderRadius: '8px' }}
          />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Giá mua',
      dataIndex: 'purchase_price',
      key: 'purchase_price',
      render: (price) => `₫${price.toLocaleString()}`,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Ngày sản xuất',
      dataIndex: 'production_date',
      key: 'production_date',
      render: (date) => formatDate(date),
    },
    {
      title: 'Ngày hết hạn',
      dataIndex: 'expiration_date',
      key: 'expiration_date',
      render: (date) => formatDate(date),
    },
    {
      title: 'Tình trạng',
      dataIndex: 'availability',
      key: 'availability',
      render: (_, record) => (
        <Tag color={record.quantity > 0 ? 'green' : 'red'}>
          {record.quantity > 0 ? 'Còn hàng' : 'Hết hàng'}
        </Tag>
      ),
    },
  ];

  return (
    <>
      <Input.Search
        placeholder="Tìm kiếm theo tên sản phẩm hoặc mã vạch"
        onChange={e => handleSearch(e.target.value)}
        style={{ marginBottom: 16 }}
        size="large"
      />
      
      <Table 
        columns={columns} 
        dataSource={filteredProducts} 
        onRow={(record) => ({
          onClick: () => showModal(record),
        })}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: true }}
        loading={loading}
      />
      <Modal
        title={<Typography.Title level={4}>{selectedProduct?.product_name}</Typography.Title>}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        footer={[
          <Button key="edit" type="primary" icon={<EditOutlined />} onClick={showEditModal}>
            Chỉnh sửa
          </Button>,
          <Button key="delete" type="primary" danger icon={<DeleteOutlined />} onClick={handleDelete}>
            Xóa
          </Button>,
          <Button key="back" icon={<CloseOutlined />} onClick={handleCancel}>
            Đóng
          </Button>,
        ]}
      >
        {selectedProduct && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>Thông tin chính</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography color="text.secondary">Tên sản phẩm</Typography>
                    <Typography variant="body1">{selectedProduct.product_name}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="text.secondary">Mã vạch</Typography>
                    <Typography variant="body1">{selectedProduct.barcode}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="text.secondary">Danh mục sản phẩm</Typography>
                    <Typography variant="body1">{catalogs.find(cat => cat.id === selectedProduct.catalogy_id)?.catalogy_name}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="text.secondary">Ngày sản xuất</Typography>
                    <Typography variant="body1">{formatDate(selectedProduct.production_date)}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="text.secondary">Ngày hết hạn</Typography>
                    <Typography variant="body1">{formatDate(selectedProduct.expiration_date)}</Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>Thông tin nhà máy sản xuất</Typography>
                <Typography variant="body1">{factories.find(fac => fac.id === selectedProduct.factory_id)?.factory_name}</Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>Thông tin giá</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography color="text.secondary">Giá mua vào</Typography>
                    <Typography variant="body1" fontWeight="bold">₫{selectedProduct.purchase_price.toLocaleString()}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="text.secondary">Giá bán ra</Typography>
                    <Typography variant="body1" fontWeight="bold" color="primary">₫{selectedProduct.selling_price.toLocaleString()}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                <Image
                  src={selectedProduct.image}
                  alt={selectedProduct.product_name}
                  style={{ width: '100%', marginBottom: '20px', borderRadius: '8px' }}
                />
                <Typography variant="h6" gutterBottom>Số lượng</Typography>
                <Typography variant="h4" align="center">{selectedProduct.quantity}</Typography>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Modal>
      <ProductForm
        visible={isEditModalVisible}
        onCancel={handleEditCancel}
        onSubmit={handleEditSubmit}
        initialValues={selectedProduct}
        catalogs={catalogs}
        factories={factories}
      />
    </>
  );
};

export default ProductsTable;
