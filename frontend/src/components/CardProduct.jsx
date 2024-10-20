import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import BookmarkAdd from '@mui/icons-material/BookmarkAddOutlined';

export default function BasicCard({product,onClick}) {
  const handleOnClick = () => {
    // // Retrieve existing products from localStorage
    // const existingProducts = JSON.parse(localStorage.getItem('order_product')) || [];

    // // Check if the product already exists
    // const productIndex = existingProducts.findIndex(p => p.product_id === product.id);

    // if (productIndex > -1) {
    //   // If product exists, update the quantity
    //   existingProducts[productIndex].quantity += 1;
    // } else {
    //   // If product does not exist, create a new entry
    //   const product_order = {
    //     product_id: product.id,
    //     productName: product.product_name,
    //     quantity: 1,
    //     price: product.purchase_price,
    //   };
    //   existingProducts.push(product_order);
    // }

    // // Save the updated list back to localStorage
    // localStorage.setItem('order_product', JSON.stringify(existingProducts));

    // // Optionally, provide feedback to the user
    // console.log('Product added or updated in localStorage!');
    onClick(product);
  };

  return (
    <Card sx={{ }}>
      <div>
        <Typography level="title-lg">{product.product_name}</Typography>
        <Typography level="body-sm">{product.barcode}</Typography>
        <IconButton
          aria-label="bookmark"
          variant="plain"
          color="neutral"
          size="sm"
          sx={{ position: 'absolute', top: '0.875rem', right: '0.5rem' }}
        >
          <BookmarkAdd />
        </IconButton>
      </div>
      <AspectRatio minHeight="120px" maxHeight="200px">
        <img
          src={product.image}
          srcSet={product.image}
          loading="lazy"
          alt={product.product_name}
        />
      </AspectRatio>
      <CardContent orientation="horizontal">
        <div>
          <Typography level="body-xs">Total price:</Typography>
          <Typography sx={{ fontSize: 'lg', fontWeight: 'lg' }}>
<<<<<<< HEAD
            {product.selling_price}
=======
            {product.purchase_price}
>>>>>>> 60f6a0aa052873cde43c9d5c60ab60def300748c
          </Typography>
        </div>
        <Button
          variant="solid"
          size="md"
          color="primary"
          aria-label="Add product"
          sx={{ ml: 'auto', alignSelf: 'center', fontWeight: 600 }}
          onClick={()=>handleOnClick(product)} // Pass function reference without parentheses
        >
          Add
        </Button>
      </CardContent>
    </Card>
  );
}
