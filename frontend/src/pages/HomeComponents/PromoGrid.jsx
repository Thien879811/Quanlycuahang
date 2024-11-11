import { Paper, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';

const PromoGrid = ({activePromotion}) => {
    return (
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
                                        secondary="Quà tặng kèm"
                                        sx={{ ml: 2 }}
                                    />
                                </>
                            )}
                        </ListItem>
                    ))}
                </List>
            )}
        </Paper>
    );
};

export default PromoGrid;
