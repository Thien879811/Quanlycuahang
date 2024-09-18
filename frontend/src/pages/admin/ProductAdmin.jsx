import React from 'react';
import { Layout, Input, Button, Space, Avatar } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import OverallInventory from '../../components/admin/product/OverallInventory';
import ProductsTable from '../../components/admin/product/ProductsTable.jsx';

const { Header, Content } = Layout;
const { Search } = Input;

const Inventory = () => {
  return (
    <Layout>
      <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
        <OverallInventory />
        <div style={{ marginTop: 24 }}>
          <h2>Sản phẩm</h2>
          <Space style={{ marginBottom: 16 }}>
            <Button type="primary">Thêm sản phẩm</Button>
            <Button>Bộ lọc</Button>
            <Button>Tải xuống tất cả</Button>
          </Space>
          <ProductsTable />
        </div>
      </Content>
    </Layout>
  );
};

export default Inventory;