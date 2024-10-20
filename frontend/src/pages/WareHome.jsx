<<<<<<< HEAD
import React from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import InventoryIcon from '@mui/icons-material/Inventory';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';

const WareHome = () => {
  const warehousingFunctions = [
    {
      title: 'Kiểm tra hàng hóa',
      description: 'Kiểm tra và cập nhật trạng thái hàng hóa trong kho',
      icon: <InventoryIcon fontSize="large" />,
      link: '/check-receipt'
    },
    {
      title: 'Báo cáo tồn kho',
      description: 'Xem và tạo báo cáo về tình trạng tồn kho hiện tại',
      icon: <AssessmentIcon fontSize="large" />,
      link: '/inventory-report'
    },
    {
      title: 'Yêu cầu hủy sản phẩm',
      description: 'Tạo yêu cầu hủy sản phẩm hết hạn hoặc hỏng',
      icon: <DeleteSweepIcon fontSize="large" />,
      link: '/admin/product-disposal'
    }
  ];

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ my: 4 }}>
        Quản lý kho hàng
      </Typography>
      <Grid container spacing={4}>
        {warehousingFunctions.map((func, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                {func.icon}
                <Typography gutterBottom variant="h5" component="h2">
                  {func.title}
                </Typography>
                <Typography>
                  {func.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" component={Link} to={func.link}>
                  Truy cập
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
=======
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
>>>>>>> 60f6a0aa052873cde43c9d5c60ab60def300748c
  );
};

export default WareHome;
