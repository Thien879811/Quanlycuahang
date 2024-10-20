import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Paper, TextField, Typography, Box, Button, Dialog, DialogTitle,
	DialogContent, DialogActions, List, ListItem, ListItemText, ListItemIcon
	} from '@mui/material';
import useOrderProduct from '../utils/orderproduct';
import useOrder from '../utils/orderUtils';
import useCustomer from '../utils/customerUtils';
import OrderDisplay from '../components/OrderDisplay';
import useProduct from '../utils/productUtils';
import Scanner from '../components/BarcodeScanner';
import usePromotion from '../utils/promorionUtils';
import NewCutomerDiaLog from '../components/home/NewCutomerDiaLog';
import { handlePromotion } from '../functions';

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
		getTotalDiscount
	} = useOrderProduct();

	const {createAndSendOrder, loading, error } = useOrder();
	const [containerHeight, setContainerHeight] = useState('100vh');
	const [openCustomerDialog, setOpenCustomerDialog] = useState(false);
	const [openCustomerInfoDialog, setOpenCustomerInfoDialog] = useState(false);
	const [openNewCustomerDialog, setOpenNewCustomerDialog] = useState(false);
	const [customerPhone, setCustomerPhone] = useState('');
	const [newCustomerName, setNewCustomerName] = useState('');
	const [barcode, setBarcode] = useState('');
	const {products} = useProduct();
	const [isScannerOpen, setIsScannerOpen] = useState(false);
	const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);

	//promotion
	const {promotions} = usePromotion();
	const [activePromotion, setActivePromotion] = useState([]);

	

	const {customer,
		searchCustomerByPhone, 
		createCustomer, 
		openNewCustomer, 
		openCustomerInfo,
		setOpenNewCustomer,
		setOpenCustomerInfo
	} = useCustomer();

	

	//display promotion
	useEffect(() => {
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
					const promotionsWithProductInfo = matchingPromotions.map(promo => ({
						...promo,
						productName: product.product_name,
						productImage: product.image
					}));
					foundPromotions.push(...promotionsWithProductInfo);
				}

				if (foundPromotions.length > 0) {
					setActivePromotion(foundPromotions);
					// Apply discount to orderProducts
					foundPromotions.forEach(promo => {
						updateProductDiscount(promo.product_id, promo.discount_percentage, promo.quantity, promo.present);
					});

				} else {
					setActivePromotion([]);
				}

			} else {
				setActivePromotion([]);
			}
		};
		searchPromotion();
	}, [promotions, orderProducts, updateProductDiscount]);


 
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
			createAndSendOrder();
			return navigate('/pay');
		}
		if(type === 2){
			createAndSendOrder();
			return navigate('/vnpay');
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

	const handleBarcodeChange = (event) => {
		setBarcode(event.target.value);
	};
	
	const handleBarcodeKeyPress = (event) => {
		if (event.key === 'Enter') {
			handleBarcodeScanned(barcode);
		}
	};

	const handleBarcodeScanned = (scannedBarcode) => {
		const barcodeNumber = parseInt(scannedBarcode, 10);
		const foundProduct = products.find(product => product.barcode === barcodeNumber);
		if (foundProduct) {
			addProduct(foundProduct.id, foundProduct.product_name, foundProduct.image, foundProduct.selling_price || 0, 1);
			console.log(`Added product: ${foundProduct.product_name}`);
			setBarcode('');
			setIsScannerModalOpen(false); // Close the scanner modal

			// Check for promotions
			const currentDate = new Date();
			const foundPromotion = promotions.find(promo => 
				promo.product_id === foundProduct.id &&
				new Date(promo.start_date) <= currentDate &&
				new Date(promo.end_date) >= currentDate
			);
			if (foundPromotion) {
				setActivePromotion([...activePromotion, foundPromotion]);
				updateProductDiscount(foundProduct.id, foundPromotion.discount_percentage);
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

	return (

		<Grid container spacing={2} sx={{ height: containerHeight, overflow: 'hidden' }}>
			<Grid item xs={8} sx={{ height: '100%', overflow: 'auto' }}>
				<Paper elevation={3} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
					<Box sx={{ display: 'flex', mb: 2 }}>
						<TextField
							fullWidth
							label="Scan barcode"
							variant="outlined"
							value={barcode}
							onChange={handleBarcodeChange}
							onKeyPress={handleBarcodeKeyPress}
						/>
						<Button onClick={toggleScanner}>
							{isScannerModalOpen ? 'Close Scanner' : 'Open Scanner'}
						</Button>
					</Box>
					<OrderDisplay
						getTotalDiscount={getTotalDiscount}
						orderProducts={orderProducts}
						handleIncreaseQuantity={handleIncreaseQuantity}
						handleDecreaseQuantity={handleDecreaseQuantity}
						handleRemoveProduct={handleRemoveProduct}
					/>
					<Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
						<Typography variant="h6" color="primary" gutterBottom>
							{activePromotion.length > 0 ? 'KHUYẾN MÃI' : 'KHÔNG CÓ KHUYẾN MÃI'}
						</Typography>
						{activePromotion.length > 0 && (
							<List>
								{activePromotion.map((promo, index) => (
									<ListItem key={index}>
										<ListItemIcon>
											<img src={promo.productImage} alt={promo.productName} style={{ width: 40, height: 40 }} />
										</ListItemIcon>
										<ListItemText primary={promo.productName} secondary={promo.description} />
									</ListItem>
								))}
							</List>
						)}
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
											handlePayment(1);
										}
										if (item === 'Ví Điện Tử') {
											handlePayment(2);
										}
										if (item === 'E-Voucher') {
											handlePayment();
										}
										if (item === 'Membership') {
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
						<Typography variant="h6" color="secondary">CHIẾT KHẤU: {getTotalDiscount()}</Typography>
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

	

			<Dialog open={isScannerModalOpen} onClose={toggleScanner} maxWidth="sm" fullWidth>
				<DialogContent>
					<Scanner onDetected={handleBarcodeScanned} />
				</DialogContent>
			</Dialog>
<<<<<<< HEAD
			
=======
>>>>>>> 60f6a0aa052873cde43c9d5c60ab60def300748c
		</Grid>
	);
};

export default Home;