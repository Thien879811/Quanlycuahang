import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Paper, TextField, Typography, Box, Button, Dialog, DialogTitle,
	DialogContent, DialogActions, List, ListItem, ListItemText, ListItemIcon,
	Autocomplete
	} from '@mui/material';
import useOrderProduct from '../utils/orderproduct';
import orderUtils from '../utils/orderUtils';
import useCustomer from '../utils/customerUtils';
import OrderDisplay from '../components/OrderDisplay';
import useProduct from '../utils/productUtils';
import Scanner from '../components/BarcodeScanner';
import usePromotion from '../utils/promorionUtils'; // Fixed typo in import
import orderService from '../services/order.service';
import { handleResponse } from '../functions';
import PromoGrid from './HomeComponents/PromoGrid';
import CustomerDialog from './HomeComponents/CustomerDialog';
import NewCustomerDialog from './HomeComponents/NewCustomerDialog';
import InfoCustomerDialog from './HomeComponents/InfoCustomerDialog';
import VoucherDialog from './HomeComponents/VoucherDialog';

import { message } from 'antd';
const Home = () => {
	const navigate = useNavigate();
	const {
		orders,
        getTotalAmount,
        getTotalQuantity,
        getTotalDiscount,
        addProduct,
        removeProduct,
        updateQuantity,
        updateDiscount,
        updateProductDiscount,
        updateVoucher,
        updateCustomer,
        createOrder,
        updateOrder
	} 
	= orderUtils();

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
		if(!orders.details) return;
		if(orders.details.length > 0){
			const foundPromotions = [];
			const currentDate = new Date();
			for(const product of orders.details){
				const matchingPromotions = promotions.filter(promo => 
					promo.product_id === product.product_id &&
					new Date(promo.start_date) <= currentDate &&
					new Date(promo.end_date) >= currentDate &&
					!promo.code // Only add promotions without a code
				);

				if(matchingPromotions.length > 0){
					foundPromotions.push(...matchingPromotions);
				}
			}

			if (foundPromotions.length > 0) {
				setActivePromotion(foundPromotions);
				updateProductDiscount(promotions);
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
	}, [orders.details, promotions]);

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
		const order_id = localStorage.getItem('order_id');

		if(orders.details.length === 0){
			alert('Vui lòng thêm sản phẩm vào hóa đơn');
			return;
		}
		
		if(type === 1){
			if(order_id){
				updateOrder(order_id);
			}
			const order = await createOrder();
			if(order){
				return navigate('/pay');
			}
		}
		if(type === 2){
			if(order_id){
				updateOrder(order_id,data);
			}else{
				createOrder();
			}
			const finalAmount = getTotalAmount - getTotalDiscount - (getTotalAmount - getTotalDiscount) * (orders.discount || 0) / 100;
			return navigate(`/vnpay/${order_id}/${finalAmount}`);
		}
		if(type === 3){
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
			console.log(voucher.code);
			updateVoucher(voucher, voucher.discount_percentage);
			handleCloseVoucherDialog();
		} else {
			alert('Mã voucher không hợp lệ hoặc đã hết hạn');
			setVoucherCodeInput('');
		}
	};

	const handleSearchCustomer = async () => {
		const customer = await searchCustomerByPhone(customerPhone);
		if(customer){
			updateCustomer(customer.id);
		}
		handleCloseCustomerDialog();
	};

	const handleCreateNewCustomer = () => {
		createCustomer({ name: newCustomerName, phone: customerPhone, diem: 0 });
		handleCloseNewCustomerDialog();
		updateCustomer(customer.id);
	};

	const handleIncreaseQuantity = async (productId) => {
		updateQuantity(productId, 1);
		
	};

	const handleDecreaseQuantity = async (productId) => {
		updateQuantity(productId, -1);
		
	};

	const handleRemoveProduct = async (productCode) => {
		try {
			removeProduct(productCode);
			if(response){
				message.success('Sản phẩm đã được xóa thành công');
			}
		} catch (error) {
			message.error(error.message);
		}
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
			addProduct(foundProduct);
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
									label="Mã vạch hoặc tên sản phẩm"
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
							onClick={handleBarcodeChange}
							onInputChange={(event, value) => {
								setBarcode(value);
								setSearchQuery(value);
							}}
							sx={{ flexGrow: 1 }}
						/>
					</Box>
					<OrderDisplay
						getTotalDiscount={getTotalDiscount}
						orderProducts={orders.details || []}
						handleIncreaseQuantity={handleIncreaseQuantity}
						handleDecreaseQuantity={handleDecreaseQuantity}
						handleRemoveProduct={handleRemoveProduct}
					/>
				</Paper>
				{/* Promotion */}
				<PromoGrid activePromotion={activePromotion.length > 0 ? activePromotion : []} />
			</Grid>
			{/* Payment */}
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
										if (item.name == 'Tiền Mặt') handlePayment(1);
										if (item.name == 'Ví Điện Tử') handlePayment(2);
										if (item.name == 'E-Voucher') handlePayment(3);
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
							{ name: 'Tìm Sản Phẩm', color: '#f44336', icon: '🔍' },
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
										if (item.name === 'Tìm Sản Phẩm') navigate('/product');
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
							Số lượng: {getTotalQuantity}
						</Typography>
						<Typography variant="h6" sx={{ mb: 2, color: '#2196f3', fontWeight: 600 }}>
							Thành tiền: {formatNumber(getTotalAmount).toLocaleString('vi-VN')} VNĐ
						</Typography>
						<Typography variant="h6" sx={{ mb: 2, color: '#f44336', fontWeight: 600 }}>
							Chiết khấu: {formatNumber(getTotalDiscount + (orders?.discount ? orders.discount/100 * (getTotalAmount - getTotalDiscount): 0)).toLocaleString('vi-VN')} VNĐ
						</Typography>
						{customer && (
							<Typography variant="h6" sx={{ mb: 2, color: '#4CAF50', fontWeight: 600 }}>
								Điểm tích lũy: {customer.diem} + {formatNumber(getTotalAmount)}
							</Typography>
						)}
						<Box sx={{ borderTop: '2px solid #e0e0e0', mt: 2, pt: 2 }}>
							<Typography variant="h5" sx={{ color: '#f44336', fontWeight: 700, textAlign: 'center' }}>
								TỔNG CỘNG: {formatNumber(getTotalAmount - getTotalDiscount - (orders?.discount ? orders.discount/100 * (getTotalAmount -getTotalDiscount) : 0)).toLocaleString('vi-VN')} VNĐ
							</Typography>
						</Box>
					</Box>
				</Paper>
			</Grid>

			<CustomerDialog
				openCustomerDialog={openCustomerDialog}
				handleCloseCustomerDialog={handleCloseCustomerDialog}
				customerPhone={customerPhone}
				setCustomerPhone={setCustomerPhone}
				handleSearchCustomer={handleSearchCustomer}
			/>

			<NewCustomerDialog
				openNewCustomerDialog={openNewCustomerDialog}
				handleCloseNewCustomerDialog={handleCloseNewCustomerDialog}
				newCustomerName={newCustomerName}
				setNewCustomerName={setNewCustomerName}
				handleCreateNewCustomer={handleCreateNewCustomer}
				customerPhone={customerPhone}
			/>

			<InfoCustomerDialog
				openInfoCustomerDialog={openCustomerInfoDialog}
				handleCloseInfoCustomerDialog={handleCloseCustomerInfoDialog}
				customer={customer}
			/>

			<VoucherDialog
				openVoucherDialog={openVoucherDialog}
				handleCloseVoucherDialog={handleCloseVoucherDialog}
				voucherCodeInput={voucherCodeInput}
				setVoucherCodeInput={setVoucherCodeInput}
				handleVoucherSubmit={handleVoucherSubmit}
			/>

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