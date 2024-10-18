import React, { useState, useEffect } from 'react';
import { useStateContext } from '../context/contextprovider';
import { Menu } from 'antd';
import { ImportOutlined, AppstoreOutlined } from '@ant-design/icons';
import ProductManagement from '../components/ProductManagement.jsx';
import ShelfManagement from '../components/ShelfManagement.jsx';
import ImportProducts from '../components/ImportProducts.jsx';
import HangSuDung from '../components/HangSuDung.jsx';
const WareHome = () => {
  const { user } = useStateContext();
  const [selectedMenu, setSelectedMenu] = useState('products');

  const handleMenuClick = (e) => {
    setSelectedMenu(e.key);
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case 'products':
        return <ProductManagement />;
      case 'import':
        return <ImportProducts />;
      case 'shelves':
        return <ShelfManagement />;
      case 'hang-su-dung':
        return <HangSuDung />;
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Menu
        onClick={handleMenuClick}
        style={{ width: 256 }}
        defaultSelectedKeys={['products']}
        mode="inline"
      >
        <Menu.Item key="products" icon={<AppstoreOutlined />}>
          Sản phẩm
        </Menu.Item>
        <Menu.Item key="import" icon={<ImportOutlined />}>
          Nhập hàng
        </Menu.Item>
        <Menu.Item key="shelves" icon={<AppstoreOutlined />}>
          Quản lý kệ hàng
        </Menu.Item>
        <Menu.Item key="hang-su-dung" icon={<AppstoreOutlined />}>
          Hạn sử dụng sản phẩm
        </Menu.Item>
      </Menu>
      <div style={{ flex: 1, padding: '0 24px' }}>
        <h1>Quản lý kho hàng</h1>
        {renderContent()}
      </div>
    </div>
  );
};

export default WareHome;
