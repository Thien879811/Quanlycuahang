import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Paper, TextField, Typography, Box, Button, Dialog, DialogTitle,
	DialogContent, DialogActions, List, ListItem, ListItemText, ListItemIcon,
	Autocomplete
	} from '@mui/material';
import useOrderProduct from '../utils/orderproduct';
import useOrder from '../utils/orderUtils';
import useCustomer from '../utils/customerUtils';
import OrderDisplay from '../components/OrderDisplay';
import useProduct from '../utils/productUtils';
import Scanner from '../components/BarcodeScanner';
import usePromotion from '../utils/promorionUtils';
import orderService from '../services/order.service';
import { handleResponse } from '../functions';

const Home = () => {
	const navigate = useNavigate();
	
	const {
		orderProducts,
		getTotalAmount,
		getTotalQuantity,
		updateProductQuantity,
		removeProduct,
		addProduct,
		updateProductDiscount,
		getTotalDiscount,

	} = useOrderProduct();

	const {createAndSendOrder, loading, error, updateVoucherDiscount,discount } = useOrder();
	const [containerHeight, setContainerHeight] = useState('100vh');
	const [openCustomerDialog, setOpenCustomerDialog] = useState(false);
	const [openCustomerInfoDialog, setOpenCustomerInfoDialog] = useState(false);
	const [openNewCustomerDialog, setOpenNewCustomerDialog] = useState(false);
	const [openVoucherDialog, setOpenVoucherDialog] = useState(false);
	const [customerPhone, setCustomerPhone] = useState('');
	const [newCustomerName, setNewCustomerName] = useState('');
	const [barcode, setBarcode] = useState('');
	const {products} = useProduct();
	const [isScannerOpen, setIsScannerOpen] = useState(false);
	const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [order, setOrder] = useState(null);
	const [voucherCodeInput, setVoucherCodeInput] = useState('');
	

	//promotion
	const {promotions, updateQuantity} = usePromotion();
	const [activePromotion, setActivePromotion] = useState([]);
	

	const {customer,
		searchCustomerByPhone, 
		createCustomer, 
		openNewCustomer, 
		openCustomerInfo,
		setOpenNewCustomer,
		setOpenCustomerInfo
	} = useCustomer();

	const getOrder = async ()=>{
		const order = localStorage.getItem('order_id');
		if(order){
			const response = await orderService.get(order);
			const data = handleResponse(response);
			return data;
		}
		return null;
	}

	useEffect(() => {
		const fetchOrder = async () => {
			const orderData = await getOrder();
			setOrder(orderData);
		};
		fetchOrder();
	}, []);

	// Memoize filtered products based on search query
	const filteredProducts = useMemo(() => {
		const query = searchQuery.toLowerCase();
		return products.filter(product => 
			product.barcode.toLowerCase().includes(query) ||
			product.product_name.toLowerCase().includes(query)
		);
	}, [products, searchQuery]);
	
	const searchPromotion = () => {
		if(orderProducts.length > 0){
			const foundPromotions = [];
			const currentDate = new Date();
			for(const product of orderProducts){

				const matchingPromotions = promotions.filter(promo => 
					promo.product_id === product.product_id &&
					new Date(promo.start_date) <= currentDate &&
					new Date(promo.end_date) >= currentDate
				);

				if(matchingPromotions.length > 0){
					foundPromotions.push(...matchingPromotions);
				}
			}

			if (foundPromotions.length > 0) {
				setActivePromotion(foundPromotions);
				foundPromotions.forEach(promo => {
					updateProductDiscount(promo.product_id, promotions);
				});
			} else {
				setActivePromotion([]);
			}

		} else {
			setActivePromotion([]);
		}
	};
	//display promotion
	useEffect(() => {
		searchPromotion();
	}, [orderProducts, promotions]);

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

	const handlePayment = async (type) => {
		if(orderProducts.length === 0){
			alert('Vui lòng thêm sản phẩm vào hóa đơn');
			return;
		}
		if(type === 1){
			await createAndSendOrder();
			return navigate('/pay');
		}
		if(type === 2){
			await createAndSendOrder();
			return navigate('/vnpay');
		}
		if(type === 3){
			await createAndSendOrder();
			setOpenVoucherDialog(true);
		}
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

	const handleCloseVoucherDialog = () => {
		setOpenVoucherDialog(false);
		setVoucherCodeInput('');
	};

	const handleVoucherSubmit = async () => {
		const voucher = promotions.find(promo => 
			promo.code == voucherCodeInput && 
			promo.quantity > 0 &&
			new Date(promo.start_date) <= new Date() &&
			new Date(promo.end_date) >= new Date()
		);

		if (voucher) {
			await updateVoucherDiscount(voucher.code, voucher.discount_percentage);
			handleCloseVoucherDialog();
		} else {
			alert('Mã voucher không hợp lệ hoặc đã hết hạn');
			setVoucherCodeInput('');
		}
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

	const handleBarcodeChange = (event, value) => {
		if (typeof value === 'string') {
			setBarcode(value);
			setSearchQuery(value);
		} else if (value && value.barcode) {
			handleBarcodeScanned(value.barcode);
		}
	};
	
	const handleBarcodeKeyPress = (event) => {
		if (event.key === 'Enter') {
			handleBarcodeScanned(barcode);
		}
	};

	const handleBarcodeScanned = (scannedBarcode) => {
		const foundProduct = products.find(product => product.barcode === scannedBarcode);
		if (foundProduct) {
			addProduct(foundProduct.id, foundProduct.product_name, foundProduct.image, foundProduct.selling_price || 0, 1);
			console.log(`Added product: ${foundProduct.product_name}`);
			setBarcode('');
			setSearchQuery('');
			setIsScannerModalOpen(false);
			
			const currentDate = new Date();
			const foundPromotion = promotions.find(promo => 
				promo.product_id === foundProduct.id &&
				new Date(promo.start_date) <= currentDate &&
				new Date(promo.end_date) >= currentDate
			);
			if (foundPromotion) {
				setActivePromotion([...activePromotion, foundPromotion]);
				updateProductDiscount(foundProduct.id, promotions);
			}
		} else {
			console.log('Product not found');
		}
	};

	const handleError = (error) => {
		console.error(error);
	};

	const toggleScanner = () => {
		setIsScannerModalOpen(!isScannerModalOpen);
	};

	const formatNumber = (number) => {
		return Math.floor(number/100) * 100;
	};

	return (
		<Grid container spacing={2} sx={{ height: containerHeight, overflow: 'hidden', p: 2 }}>
			<Grid item xs={8} sx={{ height: '100%', overflow: 'auto' }}>
				<Paper elevation={3} sx={{ p: 3, height: '80%', display: 'flex', flexDirection: 'column', borderRadius: '12px', backgroundColor: '#ffffff' }}>
					<Box sx={{ display: 'flex', mb: 3, gap: 2 }}>
						<Autocomplete
							fullWidth
							freeSolo
							options={filteredProducts}
							getOptionLabel={(option) => {
								if (typeof option === 'string') {
									return option;
								}
								return `${option.product_name} (${option.barcode})`;
							}}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Quét mã vạch hoặc tên sản phẩm"
									variant="outlined"
									value={barcode}
									onKeyPress={handleBarcodeKeyPress}
									sx={{ 
										'& .MuiOutlinedInput-root': {
											borderRadius: '8px',
											backgroundColor: '#f5f5f5'
										}
									}}
								/>
							)}
							onChange={handleBarcodeChange}
							onInputChange={(event, value) => {
								setBarcode(value);
								setSearchQuery(value);
							}}
							sx={{ flexGrow: 1 }}
						/>
					</Box>
					<OrderDisplay
						getTotalDiscount={getTotalDiscount}
						orderProducts={orderProducts}
						handleIncreaseQuantity={handleIncreaseQuantity}
						handleDecreaseQuantity={handleDecreaseQuantity}
						handleRemoveProduct={handleRemoveProduct}
					/>
				</Paper>
				<Paper elevation={3} sx={{ mt: 3, p: 3, backgroundColor: '#f8f9fa', borderRadius: '12px' }}>
					<Typography variant="h6" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
						{activePromotion.length > 0 ? 'KHUYẾN MÃI ĐANG ÁP DỤNG' : 'KHÔNG CÓ KHUYẾN MÃI'}
					</Typography>
					{activePromotion.length > 0 && (
						<List sx={{ maxHeight: '200px', overflow: 'auto' }}>
							{activePromotion.map((promo, index) => (
								<ListItem key={index} sx={{ 
									backgroundColor: '#ffffff', 
									mb: 1.5, 
									borderRadius: '8px',
									boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
									transition: 'all 0.3s ease',
									'&:hover': {
										transform: 'translateY(-2px)',
										boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
									}
								}}>
									<ListItemIcon>
										<img src={promo.product.image} alt={promo.product.product_name} 
											style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '6px' }} 
										/>
									</ListItemIcon>
									<ListItemText 
										primary={promo.product.product_name} 
										secondary={`Giảm giá ${promo.discount_percentage}%` + (promo.quantity ? `, khi mua ${promo.quantity} sản phẩm` : '')}
										primaryTypographyProps={{ fontWeight: 'bold', color: '#2196f3' }}
										sx={{ ml: 2 }}
									/>
									{promo.present && (
										<>
											<Typography variant="h5" color="primary" sx={{mx: 2}}>+</Typography>
											<ListItemIcon>
												<img src={promo.present.product_image} alt={promo.present.product_name} 
													style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '6px' }} 
												/>
											</ListItemIcon>
											<ListItemText
												primary={promo.present.product_name}
												primaryTypographyProps={{ fontWeight: 'bold', color: '#4CAF50' }}
												secondary={`Giảm giá ${promo.discount_percentage}%`}
												sx={{ ml: 2 }}
											/>
										</>
									)}
								</ListItem>
							))}
						</List>
					)}
				</Paper>
			</Grid>

			<Grid item xs={4} sx={{ height: '100%', overflow: 'auto' }}>
				<Paper elevation={3} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '12px', backgroundColor: '#ffffff' }}>
					<Grid container spacing={2} sx={{ mb: 3 }}>
						<Grid item xs={12}>
							<Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1976d2' }}>
								PHƯƠNG THỨC THANH TOÁN
							</Typography>
						</Grid>
						{[
							{ name: 'Tiền Mặt', color: '#4CAF50', icon: '💵' },
							{ name: 'Ví Điện Tử', color: '#2196f3', icon: '💳' },
							{ name: 'E-Voucher', color: '#ff9800', icon: '🎫' }
						].map((item) => (
							<Grid item xs={6} key={item.name}>
								<Button 
									variant="contained"
									fullWidth 
									startIcon={<span style={{fontSize: '1.2rem'}}>{item.icon}</span>}
									sx={{ 
										height: '60px',
										borderRadius: '8px',
										backgroundColor: item.color,
										fontWeight: 600,
										boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
										transition: 'all 0.3s ease',
										'&:hover': {
											backgroundColor: item.color,
											transform: 'translateY(-2px)',
											boxShadow: '0 6px 12px rgba(0,0,0,0.15)'
										}
									}}
									onClick={() => {
										if (item.name === 'Tiền Mặt') handlePayment(1);
										if (item.name === 'Ví Điện Tử') handlePayment(2);
										if (item.name === 'E-Voucher') handlePayment(3);
									}}
								>
									{item.name}
								</Button>
							</Grid>
						))}
					</Grid>

					<Grid container spacing={2} sx={{ mb: 4 }}>
						<Grid item xs={12}>
							<Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1976d2' }}>
								CHỨC NĂNG KHÁC
							</Typography>
						</Grid>
						{[
							{ name: 'Tìm Hóa Đơn', color: '#9c27b0', icon: '🔍' },
							{ name: 'Thêm Sản Phẩm', color: '#f44336', icon: '➕' },
							{ name: 'Khách Hàng', color: '#3f51b5', icon: '👥' }
						].map((item) => (
							<Grid item xs={6} key={item.name}>
								<Button 
									variant="contained"
									fullWidth 
									startIcon={<span style={{fontSize: '1.2rem'}}>{item.icon}</span>}
									sx={{ 
										height: '60px',
										borderRadius: '8px',
										backgroundColor: item.color,
										fontWeight: 600,
										boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
										transition: 'all 0.3s ease',
										'&:hover': {
											backgroundColor: item.color,
											transform: 'translateY(-2px)',
											boxShadow: '0 6px 12px rgba(0,0,0,0.15)'
										}
									}}
									onClick={() => {
										if (item.name === 'Thêm Sản Phẩm') navigate('/product');
										else if (item.name === 'Khách Hàng') handleOpenCustomerDialog();
										else if (item.name === 'Tìm Hóa Đơn') navigate('/orders');
									}}
								>
									{item.name}
								</Button>
							</Grid>
						))}
					</Grid>

					<Box sx={{ 
						mt: 'auto', 
						p: 3, 
						backgroundColor: '#f8f9fa', 
						borderRadius: '12px',
						boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
					}}>
						<Typography variant="h6" sx={{ mb: 2, color: '#555', fontWeight: 500 }}>
							Số lượng: {getTotalQuantity()}
						</Typography>
						<Typography variant="h6" sx={{ mb: 2, color: '#2196f3', fontWeight: 600 }}>
							Thành tiền: {formatNumber(getTotalAmount()).toLocaleString('vi-VN')} VNĐ
						</Typography>
						<Typography variant="h6" sx={{ mb: 2, color: '#f44336', fontWeight: 600 }}>
							Chiết khấu: {formatNumber(getTotalDiscount() + (order?.discount ? order.discount/100 * getTotalAmount() : 0)).toLocaleString('vi-VN')} VNĐ
						</Typography>
						{customer && (
							<Typography variant="h6" sx={{ mb: 2, color: '#4CAF50', fontWeight: 600 }}>
								Điểm tích lũy: {customer.diem} + {formatNumber(getTotalAmount())}
							</Typography>
						)}
						<Box sx={{ borderTop: '2px solid #e0e0e0', mt: 2, pt: 2 }}>
							<Typography variant="h5" sx={{ color: '#f44336', fontWeight: 700, textAlign: 'center' }}>
								TỔNG CỘNG: {formatNumber(getTotalAmount() - getTotalDiscount() - (order?.discount ? order.discount/100 * getTotalAmount() : 0)).toLocaleString('vi-VN')} VNĐ
							</Typography>
						</Box>
					</Box>
				</Paper>
			</Grid>

			<Dialog 
				open={openCustomerDialog} 
				onClose={handleCloseCustomerDialog}
				PaperProps={{
					sx: {
						borderRadius: '12px',
						padding: '16px',
						backgroundColor: '#ffffff'
					}
				}}
			>
				<DialogTitle sx={{ fontWeight: 600, color: '#1976d2' }}>Tìm Khách Hàng</DialogTitle>
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
						sx={{ 
							mt: 2,
							'& .MuiOutlinedInput-root': {
								borderRadius: '8px',
								backgroundColor: '#f5f5f5'
							}
						}}
					/>
				</DialogContent>
				<DialogActions>
					<Button 
						onClick={handleCloseCustomerDialog} 
						sx={{ 
							borderRadius: '8px',
							color: '#666'
						}}
					>
						Hủy
					</Button>
					<Button 
						onClick={handleSearchCustomer} 
						variant="contained"
						sx={{ 
							borderRadius: '8px',
							backgroundColor: '#4CAF50',
							'&:hover': {
								backgroundColor: '#45a049'
							}
						}}
					>
						Tìm kiếm
					</Button>
				</DialogActions>
			</Dialog>

			<Dialog 
				open={openCustomerInfoDialog} 
				onClose={handleCloseCustomerInfoDialog}
				PaperProps={{
					sx: {
						borderRadius: '12px',
						padding: '16px',
						backgroundColor: '#ffffff'
					}
				}}
			>
				<DialogTitle sx={{ fontWeight: 600, color: '#1976d2' }}>Thông tin Khách Hàng</DialogTitle>
				<DialogContent>
					{customer && (
						<Box sx={{ p: 2 }}>
							<Typography variant="h6" sx={{ mb: 2, color: '#333' }}>Tên: {customer.name}</Typography>
							<Typography variant="h6" sx={{ mb: 2, color: '#333' }}>Số điện thoại: {customer.phone}</Typography>
							<Typography variant="h6" sx={{ color: '#4CAF50', fontWeight: 600 }}>Điểm tích lũy: {customer.diem}</Typography>
						</Box>
					)}
				</DialogContent>
				<DialogActions>
					<Button 
						onClick={handleCloseCustomerInfoDialog} 
						variant="contained"
						sx={{ 
							borderRadius: '8px',
							backgroundColor: '#4CAF50',
							'&:hover': {
								backgroundColor: '#45a049'
							}
						}}
					>
						Đóng
					</Button>
				</DialogActions>
			</Dialog>

			<Dialog 
				open={openNewCustomerDialog} 
				onClose={handleCloseNewCustomerDialog}
				PaperProps={{
					sx: {
						borderRadius: '12px',
						padding: '16px',
						backgroundColor: '#ffffff'
					}
				}}
			>
				<DialogTitle sx={{ fontWeight: 600, color: '#1976d2' }}>Tạo Khách Hàng Mới</DialogTitle>
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
						sx={{ 
							mt: 2,
							'& .MuiOutlinedInput-root': {
								borderRadius: '8px',
								backgroundColor: '#f5f5f5'
							}
						}}
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
						sx={{ 
							mt: 2,
							'& .MuiOutlinedInput-root': {
								borderRadius: '8px',
								backgroundColor: '#f5f5f5'
							}
						}}
					/>
				</DialogContent>
				<DialogActions>
					<Button 
						onClick={handleCloseNewCustomerDialog} 
						sx={{ 
							borderRadius: '8px',
							color: '#666'
						}}
					>
						Hủy
					</Button>
					<Button 
						onClick={handleCreateNewCustomer} 
						variant="contained"
						sx={{ 
							borderRadius: '8px',
							backgroundColor: '#4CAF50',
							'&:hover': {
								backgroundColor: '#45a049'
							}
						}}
					>
						Tạo mới
					</Button>
				</DialogActions>
			</Dialog>

			<Dialog 
				open={openVoucherDialog} 
				onClose={handleCloseVoucherDialog}
				PaperProps={{
					sx: {
						borderRadius: '12px',
						padding: '16px',
						backgroundColor: '#ffffff'
					}
				}}
			>
				<DialogTitle sx={{ fontWeight: 600, color: '#1976d2' }}>Nhập E-Voucher</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						id="voucher"
						label="Mã E-Voucher"
						type="text"
						fullWidth
						variant="outlined"
						value={voucherCodeInput}
						onChange={(e) => setVoucherCodeInput(e.target.value)}
						sx={{ 
							mt: 2,
							'& .MuiOutlinedInput-root': {
								borderRadius: '8px',
								backgroundColor: '#f5f5f5'
							}
						}}
					/>
				</DialogContent>
				<DialogActions>
					<Button 
						onClick={handleCloseVoucherDialog} 
						sx={{ 
							borderRadius: '8px',
							color: '#666'
						}}
					>
						Hủy
					</Button>
					<Button 
						onClick={handleVoucherSubmit} 
						variant="contained"
						sx={{ 
							borderRadius: '8px',
							backgroundColor: '#4CAF50',
							'&:hover': {
								backgroundColor: '#45a049'
							}
						}}
					>
						Xác nhận
					</Button>
				</DialogActions>
			</Dialog>

			<Dialog 
				open={isScannerModalOpen} 
				onClose={toggleScanner} 
				maxWidth="sm" 
				fullWidth
				PaperProps={{
					sx: {
						borderRadius: '12px',
						overflow: 'hidden',
						backgroundColor: '#ffffff'
					}
				}}
			>
				<DialogContent sx={{ p: 0 }}>
					<Scanner onDetected={handleBarcodeScanned} />
				</DialogContent>
			</Dialog>
			
		</Grid>
	);
};

export default Home;