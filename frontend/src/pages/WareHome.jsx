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
      link: '/product-disposal'
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
  );
};

export default WareHome;
