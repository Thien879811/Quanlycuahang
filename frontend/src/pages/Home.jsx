import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Paper, TextField, Typography, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import useOrderProduct from '../utils/orderproduct';
import useOrder from '../utils/orderUtils';
import useCustomer from '../utils/customerUtils';
import OrderDisplay from '../components/OrderDisplay';

const Home = () => {
	const navigate = useNavigate();
	const {orderProducts,
		getTotalAmount,
		getTotalQuantity,
		updateProductQuantity,
		removeProduct 
		} = useOrderProduct();
	const {createAndSendOrder, loading, error } = useOrder();
	const [containerHeight, setContainerHeight] = useState('100vh');
	const [openCustomerDialog, setOpenCustomerDialog] = useState(false);
	const [openCustomerInfoDialog, setOpenCustomerInfoDialog] = useState(false);
	const [openNewCustomerDialog, setOpenNewCustomerDialog] = useState(false);
	const [customerPhone, setCustomerPhone] = useState('');
	const [newCustomerName, setNewCustomerName] = useState('');
	const {customer,
		searchCustomerByPhone, 
		createCustomer, 
		openNewCustomer, 
		openCustomerInfo,
		setOpenNewCustomer,
		setOpenCustomerInfo
	} = useCustomer();
 
	useEffect(() => {
		if(openNewCustomer){
			setOpenNewCustomerDialog(true);
		}
	}, [openNewCustomer]);

	useEffect(() => {
		if(openCustomerInfo){
			setOpenCustomerInfoDialog(true);
		}
	}, [openCustomerInfo]);


	useEffect(() => {
		const updateHeight = () => {
			const headerHeight = document.querySelector('header')?.offsetHeight || 0;
			setContainerHeight(`calc(100vh - ${headerHeight}px)`);
		};

		updateHeight();
		window.addEventListener('resize', updateHeight);

		return () => window.removeEventListener('resize', updateHeight);
	}, []);

	const handlePayment = async () => {
		createAndSendOrder();
		return navigate('/pay');
	};

	const handleOpenCustomerDialog = () => {
		setOpenCustomerDialog(true);
	};

	const handleCloseCustomerDialog = () => {
		setOpenCustomerDialog(false);
	};

	const handleCloseCustomerInfoDialog = () => {
		setOpenCustomerInfo(false);
		setOpenCustomerInfoDialog(false);
	};

	const handleCloseNewCustomerDialog = () => {
		setOpenNewCustomer(false);
		setOpenNewCustomerDialog(false);
	};

	const handleSearchCustomer = () => {
		searchCustomerByPhone(customerPhone);
		handleCloseCustomerDialog();
	};

	const handleCreateNewCustomer = () => {
		createCustomer({ name: newCustomerName, phone: customerPhone, diem: 0 });
		handleCloseNewCustomerDialog();
	};

	const handleIncreaseQuantity = (productId) => {
		updateProductQuantity(productId, 1);
	};

	const handleDecreaseQuantity = (productId) => {
		updateProductQuantity(productId, -1);
	};

	const handleRemoveProduct = (productCode) => {
		removeProduct(productCode);
	};

	return (
		<Grid container spacing={2} sx={{ height: containerHeight, overflow: 'hidden' }}>
			<Grid item xs={8} sx={{ height: '100%', overflow: 'auto' }}>
				<Paper elevation={3} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
					<TextField
						fullWidth
						label="Scan barcode"
						variant="outlined"
						sx={{ mb: 2 }}
					/>
					<OrderDisplay
						orderProducts={orderProducts}
						handleIncreaseQuantity={handleIncreaseQuantity}
						handleDecreaseQuantity={handleDecreaseQuantity}
						handleRemoveProduct={handleRemoveProduct}
					/>
					<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
						<Typography variant="h6">KHÔNG CÓ KHUYẾN MÃI</Typography>
					</Box>
				</Paper>
			</Grid>
			<Grid item xs={4} sx={{ height: '100%', overflow: 'auto' }}>
				<Paper elevation={3} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
					<Grid container spacing={2} sx={{ flexGrow: 1 }}>
						{['Tiền Mặt', 'Ví Điện Tử', 'E-Voucher', 'Membership'].map((item) => (
							<Grid item xs={3} key={item}>
								<Button 
									variant="outlined" 
									fullWidth 
									sx={{ height: '100%' }}
									onClick={() => {
										if (item === 'Tiền Mặt') {
											handlePayment();
										}
									}}
								>
									{item}
								</Button>
							</Grid>
						))}
						{['Hủy Hóa Đơn', 'Tìm Hóa Đơn', 'Thêm Sản Phẩm', 'Khách Hàng'].map((item) => (
							<Grid item xs={3} key={item}>
								<Button 
									variant="contained" 
									fullWidth 
									sx={{ 
										height: '100%', 
										backgroundColor: item === 'Hủy Hóa Đơn' ? 'white' : '#0000FF', 
										color: item === 'Hủy Hóa Đơn' ? 'black' : 'white' 
									}}
									onClick={() => {
										if (item === 'Thêm Sản Phẩm') {
											navigate('/product');
										} else if (item === 'Khách Hàng') {
											handleOpenCustomerDialog();
										} else if (item === 'Tìm Hóa Đơn') {
											navigate('/orders');
										}
									}}
								>
									{item}
								</Button>
							</Grid>
						))}
					</Grid>
					<Box sx={{ mt: 2 }}>
						<Typography variant="h6">SỐ LƯỢNG: {getTotalQuantity()}</Typography>
						<Typography variant="h6" color="primary">THÀNH TIỀN: {getTotalAmount()}</Typography>
						<Typography variant="h6" color="secondary">CHIẾT KHẤU: 0₫</Typography>
						{customer && (
							<Typography variant="h6" color="info">ĐIỂM TÍCH LŨY: {customer.diem} + {getTotalAmount()}</Typography>
						)}
						<Box sx={{ borderTop: '1px solid #ccc', mt: 2, pt: 2 }}>
							<Typography variant="h6" color="error">TỔNG CỘNG: {getTotalAmount()}</Typography>
						</Box>
					</Box>
				</Paper>
			</Grid>
			<Dialog open={openCustomerDialog} onClose={handleCloseCustomerDialog}>
				<DialogTitle>Tìm Khách Hàng</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						id="phone"
						label="Số điện thoại"
						type="tel"
						fullWidth
						variant="outlined"
						value={customerPhone}
						onChange={(e) => setCustomerPhone(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseCustomerDialog}>Hủy</Button>
					<Button onClick={() => handleSearchCustomer()}>Tìm kiếm</Button>
				</DialogActions>
			</Dialog>
			<Dialog open={openCustomerInfoDialog} onClose={handleCloseCustomerInfoDialog}>
				<DialogTitle>Thông tin Khách Hàng</DialogTitle>
				<DialogContent>
					{customer && (
						<>
							<Typography>Tên: {customer.name}</Typography>
							<Typography>Số điện thoại: {customer.phone}</Typography>
							<Typography>Điểm tích lũy: {customer.diem}</Typography>
						</>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseCustomerInfoDialog}>Đóng</Button>
				</DialogActions>
			</Dialog>
			<Dialog open={openNewCustomerDialog} onClose={handleCloseNewCustomerDialog}>
				<DialogTitle>Tạo Khách Hàng Mới</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						id="name"
						label="Tên khách hàng"
						type="text"
						fullWidth
						variant="outlined"
						value={newCustomerName}
						onChange={(e) => setNewCustomerName(e.target.value)}
					/>
					<TextField
						margin="dense"
						id="phone"
						label="Số điện thoại"
						type="tel"
						fullWidth
						variant="outlined"
						value={customerPhone}
						disabled
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseNewCustomerDialog}>Hủy</Button>
					<Button onClick={handleCreateNewCustomer}>Tạo mới</Button>
				</DialogActions>
			</Dialog>
		</Grid>
	);
};

export default Home;