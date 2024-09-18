import React, { useState, useEffect } from 'react';
import { Table, Button, message } from 'antd';
import axios from 'axios';

function PromotionList() {
    const [promotions, setPromotions] = useState([]);
  
    useEffect(() => {
      fetchPromotions();
    }, []);
  
    const fetchPromotions = async () => {
      try {
        const response = await axios.get('/api/promotions');
        setPromotions(response.data);
      } catch (error) {
        message.error('Không thể tải danh sách khuyến mãi');
      }
    };
  
    const columns = [
      { title: 'Tên', dataIndex: 'name', key: 'name' },
      { title: 'Mã', dataIndex: 'code', key: 'code' },
      { title: 'Loại', dataIndex: 'type', key: 'type' },
      { title: 'Ngày bắt đầu', dataIndex: 'startDate', key: 'startDate' },
      { title: 'Ngày kết thúc', dataIndex: 'endDate', key: 'endDate' },
      {
        title: 'Hành động',
        key: 'action',
        render: (_, record) => (
          <Button onClick={() => handleEdit(record)}>Sửa</Button>
        ),
      },
    ];
  
    const handleEdit = (promotion) => {
      // Implement edit functionality
      console.log('Edit promotion:', promotion);
    };
  
    return <Table columns={columns} dataSource={promotions} />;
  }
export default PromotionList;

