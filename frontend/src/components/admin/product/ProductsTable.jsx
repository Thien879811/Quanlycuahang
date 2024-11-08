import React, { useState } from 'react';
import { Table, Tag, Modal, Button, Form, Image, Popconfirm } from 'antd';
import { Typography, Box, Divider } from '@mui/material';
import useProducts from "../../../utils/productUtils"
import moment from 'moment';
import ProductForm from '../../../pages/admin/products/productForm';
import useCatalogs from '../../../utils/catalogUtils';
import useFactories from '../../../utils/factoryUtils';

const ProductsTable = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
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

  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'product_name',
      key: 'product_name',
      render: (text, record) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Image
            src={record.image}
            alt={text}
            width={50}
            height={50}
            style={{ marginRight: '20px', objectFit: 'cover' }}
          />
          <span style={{ marginLeft: '10px' }}>{text}</span>
        </Box>
      ),
    },
    {
      title: 'Giá mua',
      dataIndex: 'purchase_price',
      key: 'purchase_price',
      render: (price) => `₫${price}`,
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
      <Table 
        columns={columns} 
        dataSource={products} 
        onRow={(record) => ({
          onClick: () => showModal(record),
        })}
      />
      <Modal
        title={selectedProduct?.product_name}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        footer={[
          <Button key="edit" type="primary" onClick={showEditModal}>
            Chỉnh sửa
          </Button>,
          <Button key="delete" type="primary" danger onClick={handleDelete}>
            Xóa
          </Button>,
          <Button key="back" onClick={handleCancel}>
            Đóng
          </Button>,
        ]}
      >
        {selectedProduct && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ width: '65%' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Thông tin chính</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: 1 }}>
                <Typography color="text.secondary">Tên sản phẩm</Typography>
                <Typography>{selectedProduct.product_name}</Typography>
                <Typography color="text.secondary">Mã vạch</Typography>
                <Typography>{selectedProduct.barcode}</Typography>
                <Typography color="text.secondary">Danh mục sản phẩm</Typography>
                <Typography>{catalogs.find(cat => cat.id === selectedProduct.catalogy_id)?.catalogy_name}</Typography>
                <Typography color="text.secondary">Ngày sản xuất</Typography>
                <Typography>{formatDate(selectedProduct.production_date)}</Typography>
                <Typography color="text.secondary">Ngày hết hạn</Typography>
                <Typography>{formatDate(selectedProduct.expiration_date)}</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" sx={{ mb: 2 }}>Thông tin nhà máy sản xuất</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: 1 }}>
                <Typography color="text.secondary">Tên nhà máy</Typography>
                <Typography>{factories.find(fac => fac.id === selectedProduct.factory_id)?.factory_name}</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" sx={{ mb: 2 }}>Thông tin giá</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography fontWeight="bold">Giá mua vào</Typography>
                <Typography fontWeight="bold">Giá bán ra</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>{selectedProduct.purchase_price}</Typography>
                <Typography color="primary">{selectedProduct.selling_price}</Typography>
              </Box>
            </Box>
            <Box sx={{ width: '30%' }}>
              <Image
                src={selectedProduct.image}
                alt={selectedProduct.product_name}
                style={{ width: '100%', marginBottom: '20px', border: '1px dashed #ccc', padding: '10px' }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="text.secondary">Số lượng</Typography>
                <Typography>{selectedProduct.quantity}</Typography>
              </Box>
            </Box>
          </Box>
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
