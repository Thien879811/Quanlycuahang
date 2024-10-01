import React from 'react';
import { Table, Button } from 'antd';
import usePromotion from '../../../utils/promorionUtils';

function PromotionList() {
    const { promotions  } = usePromotion();

    const columns = [
        { title: 'Tên', dataIndex: 'name', key: 'name' },
        { title: 'Mã', dataIndex: 'code', key: 'code' },
        { title: 'Phần trăm giảm giá', dataIndex: 'discount_percentage', key: 'discount_percentage' },
        { title: 'ID sản phẩm', dataIndex: 'product_id', key: 'product_id' },
        { title: 'Quà tặng', dataIndex: 'present', key: 'present' },
        { title: 'Mô tả', dataIndex: 'description', key: 'description' },
        { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
        { title: 'Ngày bắt đầu', dataIndex: 'start_date', key: 'start_date' },
        { title: 'Ngày kết thúc', dataIndex: 'end_date', key: 'end_date' },
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

