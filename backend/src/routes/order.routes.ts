import { Router, Request, Response } from 'express';
import { ApiResponse } from '../types';
import { authenticate } from '../modules/auth/auth.middleware';

const router = Router();

// POST /api/orders - Create new order (requires authentication)
router.post('/', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { products, totalAmount } = req.body;
    
    // Basic validation
    if (!products || !Array.isArray(products) || products.length === 0) {
      const response: ApiResponse = {
        success: false,
        message: 'Products array is required and cannot be empty'
      };
      res.status(400).json(response);
      return;
    }
    
    if (!totalAmount || typeof totalAmount !== 'number' || totalAmount <= 0) {
      const response: ApiResponse = {
        success: false,
        message: 'Valid total amount is required'
      };
      res.status(400).json(response);
      return;
    }
    
    // Validate products structure
    for (const product of products) {
      if (!product.productId || !product.quantity || product.quantity <= 0) {
        const response: ApiResponse = {
          success: false,
          message: 'Each product must have a valid productId and quantity'
        };
        res.status(400).json(response);
        return;
      }
    }
    
    // Mock response - in real app, save to database
    const orderId = "64e3a1b2c4d5e6f7g8h9i0j6";
    const response: ApiResponse = {
      success: true,
      message: "Order placed successfully",
      data: {
        order: {
          id: orderId,
          status: "pending",
          products: products,
          totalAmount: totalAmount,
          userId: "current_user_id", // In real app, get from req.user
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating order:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Failed to create order'
    };
    res.status(500).json(response);
  }
});

// GET /api/orders/my-orders - Get current user's orders (requires authentication)
router.get('/my-orders', authenticate, async (req: Request, res: Response) => {
  try {
    // Mock response - in real app, fetch from database by user ID
    const response: ApiResponse = {
      success: true,
      data: {
        orders: [
          {
            id: "64e3a1b2c4d5e6f7g8h9i0j6",
            status: "pending",
            totalAmount: 499.99,
            products: [
              {
                productId: "64e3a1b2c4d5e6f7g8h9i0j1",
                quantity: 1,
                title: "PS5",
                price: 499.99,
                image: "/ps5.jpg"
              }
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: "64e3a1b2c4d5e6f7g8h9i0j7",
            status: "shipped",
            totalAmount: 479.99,
            products: [
              {
                productId: "64e3a1b2c4d5e6f7g8h9i0j3",
                quantity: 1,
                title: "Xbox Series X",
                price: 479.99,
                image: "/xbox.jpg"
              }
            ],
            createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            updatedAt: new Date().toISOString()
          }
        ],
        total: 2
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Failed to fetch orders'
    };
    res.status(500).json(response);
  }
});

// GET /api/orders/:id - Get order by ID (requires authentication)
router.get('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Mock response - in real app, fetch from database by ID and verify ownership
    const response: ApiResponse = {
      success: true,
      data: {
        id: id,
        status: "pending",
        totalAmount: 499.99,
        products: [
          {
            productId: "64e3a1b2c4d5e6f7g8h9i0j1",
            quantity: 1,
            title: "PS5",
            price: 499.99,
            image: "/ps5.jpg",
            seller: {
              username: "gaming_seller",
              rating: 4.8
            }
          }
        ],
        shippingAddress: {
          street: "123 Main St",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "USA"
        },
        paymentMethod: {
          type: "credit_card",
          last4: "1234"
        },
        userId: "current_user_id",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching order:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Order not found'
    };
    res.status(404).json(response);
  }
});

// PUT /api/orders/:id/status - Update order status (requires authentication)
router.put('/:id/status', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      const response: ApiResponse = {
        success: false,
        message: `Invalid status. Valid statuses are: ${validStatuses.join(', ')}`
      };
      res.status(400).json(response);
      return;
    }
    
    // Mock response - in real app, update in database and verify ownership/permissions
    const response: ApiResponse = {
      success: true,
      message: "Order status updated",
      data: {
        id: id,
        status: status,
        updatedAt: new Date().toISOString()
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error updating order status:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Failed to update order status'
    };
    res.status(500).json(response);
  }
});

export default router;