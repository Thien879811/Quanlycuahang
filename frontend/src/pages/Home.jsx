import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Paper, TextField, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Typography, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import useOrderProduct from '../utils/orderproduct';
import useOrder from '../utils/orderUtils';
import useCustomer from '../utils/customerUtils';

const Home = () => {
	const navigate = useNavigate();
	const { orderProducts, getTotalAmount, getTotalQuantity } = useOrderProduct();
	const { createAndSendOrder, loading, error } = useOrder();
	const [containerHeight, setContainerHeight] = useState('100vh');
	const [openCustomerDialog, setOpenCustomerDialog] = useState(false);
	const [openCustomerInfoDialog, setOpenCustomerInfoDialog] = useState(false);
	const [openNewCustomerDialog, setOpenNewCustomerDialog] = useState(false);
	const [customerPhone, setCustomerPhone] = useState('');
	const [newCustomerName, setNewCustomerName] = useState('');
	const {customer, searchCustomerByPhone, createCustomer, setCustomer } = useCustomer();


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
		navigate('/pay');
	};

	const handleOpenCustomerDialog = () => {
		setOpenCustomerDialog(true);
	};

	const handleCloseCustomerDialog = () => {
		setOpenCustomerDialog(false);
	};

	const handleCloseCustomerInfoDialog = () => {
		setOpenCustomerInfoDialog(false);
	};

	const handleCloseNewCustomerDialog = () => {
		setOpenNewCustomerDialog(false);
	};

	const handleSearchCustomer = () => {
		searchCustomerByPhone(customerPhone);
		
			if (customer) {
				setOpenCustomerInfoDialog(true);
			} else{
				setOpenNewCustomerDialog(true);
			}
		
		handleCloseCustomerDialog();
	};

	const handleCreateNewCustomer = () => {
		createCustomer({ name: newCustomerName, phone: customerPhone, diem: 0 });
		handleCloseNewCustomerDialog();
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
					<TableContainer sx={{ flexGrow: 1, overflow: 'auto' }}>
						<Table stickyHeader>
							<TableHead>
								<TableRow>
									<TableCell sx={{ backgroundColor: '#0000FF', color: 'white' }}>Tên sản phẩm</TableCell>
									<TableCell sx={{ backgroundColor: '#0000FF', color: 'white' }}>Đơn giá</TableCell>
									<TableCell sx={{ backgroundColor: '#0000FF', color: 'white' }}>SL</TableCell>
									<TableCell sx={{ backgroundColor: '#0000FF', color: 'white' }}>CK</TableCell>
									<TableCell sx={{ backgroundColor: '#0000FF', color: 'white' }}>Thành tiền</TableCell>
									<TableCell sx={{ backgroundColor: '#0000FF', color: 'white' }}>Ghi chú</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{orderProducts.length > 0 ? (
									orderProducts.map((item, index) => (
										<TableRow key={index}>
											<TableCell>{item.productName}</TableCell>
											<TableCell>{item.price ? item.price.toFixed(2) : '0.00'}₫</TableCell>
											<TableCell>{item.quantity}</TableCell>
											<TableCell>0₫</TableCell>
											<TableCell>{item.price ? (item.price * item.quantity).toFixed(2) : '0.00'}₫</TableCell>
											<TableCell></TableCell>
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell colSpan={6} align="center">
											<Typography variant="h6">Không có sản phẩm</Typography>
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</TableContainer>
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
						<Typography variant="h6" color="error">TỔNG CỘNG: {getTotalAmount()}</Typography>
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