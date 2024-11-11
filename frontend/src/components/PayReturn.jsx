import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Modal, Result } from 'antd';
import useOrder from '../utils/orderUtils';
import useCustomer from '../utils/customerUtils';
import OrderService from '../services/order.service';

const PaymentReturn = () => {
  const [isModalVisible, setIsModalVisible] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const responseCode = queryParams.get('vnp_ResponseCode');
  const txnRef = queryParams.get('vnp_TxnRef');
  const amount = queryParams.get('vnp_Amount');
  const {orders, updateOrderProducts} = useOrder();
  const {updatePointCustomer} = useCustomer();

  const getResponseMessage = (code) => {
    const messages = {
      '00': 'Giao dịch thành công',
      '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
      '09': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
      '10': 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
      '11': 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
      '12': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.',
      '13': 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP).',
      '24': 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
      '51': 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
      '65': 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
      '75': 'Ngân hàng thanh toán đang bảo trì.',
      '79': 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định.',
      '99': 'Các lỗi khác'
    };
    return messages[code] || 'Lỗi không xác định';
  };

  const handleCloseModal = async () => {
    setIsModalVisible(false);
    navigate('/');
  };

  const handleSuccess = async () => {
    if (responseCode === '00') {
      const data = {
        status: '2',
        pays_id: '2',
        products: orders.details
      }
      try {
        const res = await OrderService.update(txnRef, data);
        console.log(res);
        updatePointCustomer(amount);
        setIsModalVisible(false);
      } catch (error) {
        console.log(error);
      }
    }
  }

  useEffect(() => {
    handleSuccess();
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
        subTitle={getResponseMessage(responseCode)}
      />
    </Modal>
  );
};

export default PaymentReturn;
