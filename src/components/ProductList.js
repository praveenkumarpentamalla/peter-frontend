import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

// Mock data for demonstration
const mockProducts = [
  {
    product_id: 1,
    name: "Classic Mayonnaise",
    price: "4.99",
    description: "Our original creamy mayonnaise made with simple ingredients",
    image_url: "https://via.placeholder.com/300x200?text=Classic+Mayo"
  },
  {
    product_id: 2,
    name: "Spicy Mayonnaise",
    price: "5.49",
    description: "Creamy mayonnaise with a kick of chili",
    image_url: "https://via.placeholder.com/300x200?text=Spicy+Mayo"
  },
  {
    product_id: 3,
    name: "Garlic Aioli",
    price: "5.99",
    description: "Rich garlic-infused mayonnaise perfect for dipping",
    image_url: "https://via.placeholder.com/300x200?text=Garlic+Aioli"
  }
];

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [currentProduct, setCurrentProduct] = useState({
    product_id: '',
    name: '',
    price: '',
    description: '',
    image_url: ''
  });

  useEffect(() => {
    // Simulate API call with timeout
    const timer = setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleOpenDialog = (product = null) => {
    setCurrentProduct(product || {
      product_id: '',
      name: '',
      price: '',
      description: '',
      image_url: ''
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    try {
      if (currentProduct.product_id) {
        // Update existing product
        setProducts(prev => prev.map(p => 
          p.product_id === currentProduct.product_id ? currentProduct : p
        ));
        showSnackbar('Product updated successfully', 'success');
      } else {
        // Add new product
        const newProduct = {
          ...currentProduct,
          product_id: Math.max(...products.map(p => p.product_id), 0) + 1
        };
        setProducts(prev => [...prev, newProduct]);
        showSnackbar('Product added successfully', 'success');
      }
      handleCloseDialog();
    } catch (error) {
      showSnackbar('Error saving product', 'error');
      console.error('Error saving product:', error);
    }
  };

  const handleDelete = (productId) => {
    try {
      setProducts(prev => prev.filter(p => p.product_id !== productId));
      showSnackbar('Product deleted successfully', 'success');
    } catch (error) {
      showSnackbar('Error deleting product', 'error');
      console.error('Error deleting product:', error);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading && products.length === 0) {
    return (
      <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h2" gutterBottom style={{ margin: '20px 0' }}>
        Peter's Mayonnaise Emporium
      </Typography>
      
      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={() => handleOpenDialog()}
        style={{ marginBottom: '20px' }}
      >
        Add Product
      </Button>
      
      {products.length === 0 && !loading ? (
        <Typography variant="h6" color="textSecondary">
          No products found. Add your first product!
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {products.map((product) => (
            <Grid item key={product.product_id} xs={12} sm={6} md={4}>
              <Card>
                {product.image_url && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={product.image_url}
                    alt={product.name}
                  />
                )}
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {product.description}
                  </Typography>
                  <Typography variant="h6" color="primary" paragraph>
                    ${product.price}
                  </Typography>
                  <Button
                    size="small"
                    color="primary"
                    startIcon={<Edit />}
                    onClick={() => handleOpenDialog(product)}
                    style={{ marginRight: '8px' }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => handleDelete(product.product_id)}
                  >
                    Delete
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          {currentProduct.product_id ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Product Name"
            fullWidth
            variant="outlined"
            value={currentProduct.name}
            onChange={handleChange}
            required
            style={{ marginBottom: '16px' }}
          />
          <TextField
            margin="dense"
            name="price"
            label="Price"
            type="number"
            fullWidth
            variant="outlined"
            value={currentProduct.price}
            onChange={handleChange}
            required
            style={{ marginBottom: '16px' }}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={currentProduct.description}
            onChange={handleChange}
            style={{ marginBottom: '16px' }}
          />
          <TextField
            margin="dense"
            name="image_url"
            label="Image URL"
            fullWidth
            variant="outlined"
            value={currentProduct.image_url}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductList;
