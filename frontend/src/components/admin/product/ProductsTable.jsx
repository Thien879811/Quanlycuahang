import React, { useState } from 'react';
import { Table, Tag, Modal } from 'antd';
import { Typography, Box, Divider } from '@mui/material';

const ProductsTable = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

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

  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => text,
    },
    {
      title: 'Giá mua',
      dataIndex: 'buyingPrice',
      key: 'buyingPrice',
      render: (price) => `₫${price}`,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Ngưỡng tồn kho',
      dataIndex: 'threshold',
      key: 'threshold',
    },
    {
      title: 'Ngày hết hạn',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
    },
    {
      title: 'Tình trạng',
      dataIndex: 'availability',
      key: 'availability',
      render: (availability) => (
        <Tag color={availability === 'Còn hàng' ? 'green' : 'red'}>
          {availability}
        </Tag>
      ),
    },
  ];

  const data = [
    {
      key: '1',
      name: 'Mì Maggi',
      buyingPrice: 430,
      quantity: '43 Gói',
      threshold: '12 Gói',
      expiryDate: '11/12/22',
      availability: 'Còn hàng',
    },
    // Thêm dữ liệu cho các sản phẩm khác...
  ];

  return (
    <>
      <Table 
        columns={columns} 
        dataSource={data} 
        onRow={(record) => ({
          onClick: () => showModal(record),
        })}
      />
      <Modal
        title={selectedProduct?.name}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        footer={null}
      >
        {selectedProduct && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ width: '65%' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Thông tin chính</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: 1 }}>
                <Typography color="text.secondary">Tên sản phẩm</Typography>
                <Typography>{selectedProduct.name}</Typography>
                <Typography color="text.secondary">Mã sản phẩm</Typography>
                <Typography>{selectedProduct.id}</Typography>
                <Typography color="text.secondary">Danh mục sản phẩm</Typography>
                <Typography>{selectedProduct.category}</Typography>
                <Typography color="text.secondary">Ngày hết hạn</Typography>
                <Typography>{selectedProduct.expiryDate}</Typography>
                <Typography color="text.secondary">Ngưỡng tồn kho</Typography>
                <Typography>{selectedProduct.threshold}</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" sx={{ mb: 2 }}>Thông tin nhà cung cấp</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: 1 }}>
                <Typography color="text.secondary">Tên nhà cung cấp</Typography>
                <Typography>{selectedProduct.supplierName}</Typography>
                <Typography color="text.secondary">Số điện thoại</Typography>
                <Typography>{selectedProduct.supplierContact}</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" sx={{ mb: 2 }}>Vị trí tồn kho</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography fontWeight="bold">Tên cửa hàng</Typography>
                <Typography fontWeight="bold">Số lượng tồn kho</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>{selectedProduct.storeName}</Typography>
                <Typography color="primary">{selectedProduct.stockInHand}</Typography>
              </Box>
            </Box>
            <Box sx={{ width: '30%' }}>
              <img src={selectedProduct.image} alt={selectedProduct.name} style={{ width: '100%', marginBottom: '20px', border: '1px dashed #ccc', padding: '10px' }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="text.secondary">Tồn kho đầu kỳ</Typography>
                <Typography>{selectedProduct.openingStock}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="text.secondary">Tồn kho hiện tại</Typography>
                <Typography>{selectedProduct.remainingStock}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="text.secondary">Đang vận chuyển</Typography>
                <Typography>{selectedProduct.onTheWay}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="text.secondary">Ngưỡng tồn kho</Typography>
                <Typography>{selectedProduct.threshold}</Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Modal>
    </>
  );
};

export default ProductsTable;
