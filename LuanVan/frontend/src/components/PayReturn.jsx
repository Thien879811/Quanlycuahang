import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Modal, Result } from 'antd';
import useOrder from '../utils/orderUtils';
import useCustomer from '../utils/customerUtils';


const PaymentReturn = () => {
  const [isModalVisible, setIsModalVisible] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const responseCode = queryParams.get('vnp_ResponseCode');
  const txnRef = queryParams.get('vnp_TxnRef');
  const amount = queryParams.get('vnp_Amount');
  const {updateOrder,clearOrder} = useOrder();
  const {updatePointCustomer} = useCustomer();

  const handleCloseModal = async () => {
    if (responseCode === '00') {
      try {
        await updateOrder(txnRef,'1','2');
        updatePointCustomer(amount);
        clearOrder();
      } catch (error) {
        console.error('Error updating order:', error);
      }
    }
    setIsModalVisible(false);
    navigate('/');
  };

  useEffect(() => {
    if (!isModalVisible) {
      navigate('/');
    }
  }, [isModalVisible, navigate]);

  return (
    <Modal
      title="Kết quả thanh toán"
      open={isModalVisible}
      onOk={handleCloseModal}
      onCancel={handleCloseModal}
      okText="Trở về trang chủ"
      cancelText="Đóng"
    >
      <Result
        status={responseCode === '00' ? 'success' : 'error'}
        title={responseCode === '00' ? 'Thanh toán thành công' : 'Thanh toán thất bại'}
      />
    </Modal>
  );
};

export default PaymentReturn;
