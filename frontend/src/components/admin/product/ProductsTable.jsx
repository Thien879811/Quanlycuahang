import React, { useState } from 'react';
import { Table, Tag, Modal, Button, Form, Image, Input, Space, Typography as AntTypography } from 'antd';
import { Typography, Box, Divider, Grid, Paper } from '@mui/material';
import useProducts from "../../../utils/productUtils";
import moment from 'moment';
import ProductForm from '../../../pages/admin/products/productForm';
import useCatalogs from '../../../utils/catalogUtils';
import useFactories from '../../../utils/factoryUtils';
import { EditOutlined, DeleteOutlined, CloseOutlined, SearchOutlined } from '@ant-design/icons';
import { API_URL } from '../../../services/config';

const ProductsTable = ({products, fetchProducts}) => {
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const {updateProduct, deleteProduct} = useProducts();
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
        fetchProducts();
      }
    });
  };

  const formatDate = (date) => {
    return moment(date).format('DD/MM/YYYY');
  };

  const handleSearch = (value) => {
    setLoading(true);
    
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

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
            src={`${API_URL}${record.image}`}
            alt={text}
            width={60}
            height={60}
            style={{ objectFit: 'cover', borderRadius: '10px', border: '2px solid #f0f0f0' }}
          />
          <div>
            <AntTypography.Text strong>{text}</AntTypography.Text>
            <br />
            <AntTypography.Text type="secondary" style={{fontSize: '12px'}}>
              {record.barcode}
            </AntTypography.Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Giá mua',
      dataIndex: 'purchase_price',
      key: 'purchase_price',
      render: (price) => (
        <AntTypography.Text strong style={{color: '#52c41a'}}>
          ₫{price.toLocaleString()}
        </AntTypography.Text>
      ),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity) => (
        <AntTypography.Text strong>
          {quantity}
        </AntTypography.Text>
      ),
    },
    {
      title: 'Ngày sản xuất',
      dataIndex: 'production_date',
      key: 'production_date',
      render: (date) => (
        <AntTypography.Text>
          {formatDate(date)}
        </AntTypography.Text>
      ),
    },
    {
      title: 'Ngày hết hạn',
      dataIndex: 'expiration_date', 
      key: 'expiration_date',
      render: (date) => (
        <AntTypography.Text>
          {formatDate(date)}
        </AntTypography.Text>
      ),
    },
    {
      title: 'Tình trạng',
      dataIndex: 'availability',
      key: 'availability',
      render: (_, record) => (
        <Tag color={record.quantity > 0 ? 'success' : 'error'} style={{borderRadius: '15px', padding: '4px 12px'}}>
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
        style={{ 
          marginBottom: 24,
          width: '100%',
          maxWidth: 500
        }}
        size="large"
        prefix={<SearchOutlined style={{color: '#bfbfbf'}} />}
      />
      
      <Table 
        columns={columns}
        dataSource={filteredProducts}
        onRow={(record) => ({
          onClick: () => showModal(record),
          style: { cursor: 'pointer' }
        })}
        rowKey="id"
        pagination={{ 
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} sản phẩm`
        }}
        scroll={{ x: true }}
        loading={loading}
      />
      <Modal
        title={
          <Typography variant="h5" style={{margin: 0}}>
            {selectedProduct?.product_name}
          </Typography>
        }
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={900}
        footer={[
          <Button 
            key="edit" 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={showEditModal}
            style={{borderRadius: '6px'}}
          >
            Chỉnh sửa
          </Button>,
          <Button 
            key="delete" 
            type="primary" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={handleDelete}
            style={{borderRadius: '6px'}}
          >
            Xóa
          </Button>,
          <Button 
            key="back" 
            icon={<CloseOutlined />} 
            onClick={handleCancel}
            style={{borderRadius: '6px'}}
          >
            Đóng
          </Button>,
        ]}
        bodyStyle={{padding: '24px'}}
      >
        {selectedProduct && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper elevation={3} sx={{ p: 3, height: '100%', borderRadius: '12px' }}>
                <Typography variant="h6" gutterBottom sx={{fontWeight: 600, color: '#1890ff'}}>
                  Thông tin chính
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Typography color="text.secondary" sx={{fontSize: '0.875rem'}}>Tên sản phẩm</Typography>
                    <Typography variant="body1" sx={{fontWeight: 500}}>{selectedProduct.product_name}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="text.secondary" sx={{fontSize: '0.875rem'}}>Mã vạch</Typography>
                    <Typography variant="body1" sx={{fontWeight: 500}}>{selectedProduct.barcode}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="text.secondary" sx={{fontSize: '0.875rem'}}>Danh mục sản phẩm</Typography>
                    <Typography variant="body1" sx={{fontWeight: 500}}>
                      {catalogs.find(cat => cat.id === selectedProduct.catalogy_id)?.catalogy_name}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="text.secondary" sx={{fontSize: '0.875rem'}}>Ngày sản xuất</Typography>
                    <Typography variant="body1" sx={{fontWeight: 500}}>{formatDate(selectedProduct.production_date)}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="text.secondary" sx={{fontSize: '0.875rem'}}>Ngày hết hạn</Typography>
                    <Typography variant="body1" sx={{fontWeight: 500}}>{formatDate(selectedProduct.expiration_date)}</Typography>
                  </Grid>
                </Grid>
                <Divider sx={{my: 3}} />
                <Typography variant="h6" gutterBottom sx={{fontWeight: 600, color: '#1890ff'}}>Thông tin giá</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Typography color="text.secondary" sx={{fontSize: '0.875rem'}}>Giá mua vào</Typography>
                    <Typography variant="h6" sx={{color: '#52c41a', fontWeight: 600}}>
                      ₫{selectedProduct.purchase_price.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="text.secondary" sx={{fontSize: '0.875rem'}}>Giá bán ra</Typography>
                    <Typography variant="h6" sx={{color: '#1890ff', fontWeight: 600}}>
                      ₫{selectedProduct.selling_price.toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 3, height: '100%', borderRadius: '12px' }}>
                <Image
                  src={`${API_URL}${selectedProduct.image}`}
                  alt={selectedProduct.product_name}
                  style={{ 
                    width: '100%', 
                    marginBottom: '24px', 
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Typography variant="h6" gutterBottom sx={{fontWeight: 600, color: '#1890ff', textAlign: 'center'}}>
                  Số lượng tồn kho
                </Typography>
                <Typography variant="h3" align="center" sx={{fontWeight: 700, color: selectedProduct.quantity > 0 ? '#52c41a' : '#ff4d4f'}}>
                  {selectedProduct.quantity}
                </Typography>
                <Tag 
                  color={selectedProduct.quantity > 0 ? 'success' : 'error'} 
                  style={{
                    borderRadius: '15px', 
                    padding: '4px 12px',
                    margin: '12px auto',
                    display: 'table'
                  }}
                >
                  {selectedProduct.quantity > 0 ? 'Còn hàng' : 'Hết hàng'}
                </Tag>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Modal>
      {isEditModalVisible && (
        <ProductForm
          visible={isEditModalVisible}
          onCancel={handleEditCancel}
          onSubmit={handleEditSubmit}
          initialValues={selectedProduct}
          catalogs={catalogs}
          factories={factories}
          fetchProducts={fetchProducts}
        />
      )}
    </>
  );
};

export default ProductsTable;
