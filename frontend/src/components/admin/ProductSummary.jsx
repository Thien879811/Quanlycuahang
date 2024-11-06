import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, UnorderedListOutlined } from '@ant-design/icons';

const ProductSummary = ({productSummary}) => {
  return (
    <Card title="Tổng quan sản phẩm">
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Statistic
            title="Số nhà cung cấp"
            value={productSummary.numberOfSuppliers}
            prefix={<UserOutlined style={{ color: '#1890ff' }} />}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Số danh mục"
            value={productSummary.numberOfCategories}
            prefix={<UnorderedListOutlined style={{ color: '#13c2c2' }} />}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default ProductSummary;
