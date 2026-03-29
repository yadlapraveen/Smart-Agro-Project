# Smart Agro - Agricultural E-commerce Platform
## Built with Vanilla HTML, CSS, and JavaScript

This is a complete rebuild of the Smart Agro platform using vanilla HTML, CSS, and JavaScript for the frontend, with Node.js Express backend and MySQL database.

### Project Structure

```
smart-agro/
├── index.html                 # Main HTML file
├── styles/
│   ├── main.css              # Complete CSS with all styling
│   └── js/
│       ├── api.js            # API communication module
│       ├── utils.js          # Utility functions and helpers
│       ├── app.js            # Main app initialization
│       └── pages/
│           ├── home.js       # Home page
│           ├── product-detail.js    # Product detail page
│           ├── cart.js       # Shopping cart page
│           ├── checkout.js   # Checkout page
│           ├── orders.js     # Orders page
│           ├── sell-product.js      # Sell/list product page
│           ├── my-listings.js       # My listings page
│           └── settings.js   # User settings page
├── server/
│   ├── index.js              # Express server
│   ├── db.js                 # Database configuration
│   ├── init-db.js            # Database initialization
│   ├── seed.js               # Sample data seeding
│   ├── package.json          # Backend dependencies
│   ├── routes/
│   │   ├── auth.js           # Authentication routes
│   │   ├── products.js       # Products routes
│   │   ├── cart.js           # Cart routes
│   │   ├── orders.js         # Orders routes
│   │   └── listings.js       # Seller listings routes
│   └── sql/
│       └── init.sql          # Database schema
└── package.json              # Frontend dependencies (if using Vite)
```

### Frontend Features

- **Fully Responsive Design** - Works on desktop, tablet, and mobile
- **Exact Visual Styling** - Matches original React design perfectly
  - Forest Green (#1B4332)
  - Amber Gold (#D4A373)
  - Cream (#FEFAE0)
  - Sand (#FAEDCD)
  - Manrope Font
- **Core Features**:
  - Product browsing and searching
  - Product detail pages
  - Shopping cart management
  - User authentication (login/register)
  - Checkout with shipping address
  - Order tracking
  - Seller product listing
  - User settings and profile management
  - Toast notifications
  - Smooth page transitions

### Backend Features

- Express.js REST API
- MySQL database
- Authentication (login, register, profile)
- Product management
- Shopping cart
- Order processing
- Seller listings
- Database transactions for order integrity

### Color Scheme (Exact Match)

```css
--color-forest: #1B4332         (Dark Green - Primary)
--color-amber: #D4A373          (Gold/Brown - Accent)
--color-cream: #FEFAE0          (Light Beige - Background)
--color-sand: #FAEDCD           (Sand - Secondary BG)
```

### Typography

- Font: Manrope (from Google Fonts)
- Weights: 400, 500, 600, 700, 800

---

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MySQL Server (v5.7 or higher)
- npm or yarn

### Step 1: Setup Database

1. Make sure MySQL is running
2. Create a `.env` file in the `server/` directory:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=smart_agro
PORT=4000
```

3. Run database initialization:

```bash
cd server
node init-db.js
```

4. (Optional) Seed sample data:

```bash
node seed.js
```

### Step 2: Start Backend Server

```bash
cd server
npm install
npm run dev
```

The server will run on `http://localhost:4000`

### Step 3: Serve Frontend

You can either:

**Option A: Use Live Server (Recommended for Development)**
- Install VS Code extension "Live Server"
- Right-click on `index.html` → "Open with Live Server"
- Frontend will run on `http://localhost:5500`

**Option B: Use Python Simple HTTP Server**
```bash
python -m http.server 8000
```
Then open `http://localhost:8000`

**Option C: Use Node.js Simple Server**
```bash
npx http-server
```

### Step 4: Access the Application

Open your browser and navigate to:
- `http://localhost:5500` (if using Live Server)
- `http://localhost:8000` (if using Python)
- `http://localhost:8080` (if using http-server)

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - User login
- `GET /api/auth/profile/:id` - Get user profile
- `PUT /api/auth/profile/:id` - Update user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product

### Cart
- `GET /api/cart/user/:user_id` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item quantity
- `DELETE /api/cart/:id` - Remove item from cart

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/user/:user_id` - Get user's orders
- `GET /api/orders/:id` - Get order details

### Listings (Seller Products)
- `GET /api/listings/seller/:seller_email` - Get seller's listings
- `POST /api/listings` - Create new listing
- `PUT /api/listings/:id` - Update listing
- `DELETE /api/listings/:id` - Delete listing

---

## Usage Guide

### For Buyers

1. **Browse Products**
   - Go to Home page
   - Use search bar or category filters
   - Sort by price, rating, or name

2. **View Product Details**
   - Click on any product card
   - See full description, seller info, reviews
   - Adjust quantity

3. **Shopping Cart**
   - Click cart icon or "Add to Cart" button
   - Review items in cart
   - Adjust quantities

4. **Checkout**
   - Enter shipping address
   - Choose payment method
   - Place order

5. **Track Orders**
   - Go to "My Orders"
   - View order status, items, and tracking

### For Sellers

1. **List Products**
   - Go to "Sell" page
   - Fill in product details
   - Upload product image URL
   - Click "List Product"

2. **Manage Listings**
   - Go to "My Listings"
   - Edit or delete products
   - View product performance

---

## Features Breakdown

### Home Page
- Hero section with search
- Category filtering
- Product grid with sorting
- Statistics cards
- Responsive design

### Product Detail Page
- Large product image
- Detailed description
- Seller information
- Quantity selector
- Related products
- Star ratings

### Shopping Cart
- Cart items with images
- Quantity controls
- Order summary
- Shipping calculation
- Proceed to checkout

### Checkout Page
- Shipping address form
- Payment method selection
- Order notes
- Final total calculation
- Order placement

### Orders Page
- List of all orders
- Order status
- Total amount
- Order date
- Shipping address

### Sell Product Page
- Product form
- Title, description, category
- Price and stock quantity
- Image URL
- Organic badge option

### My Listings Page
- Grid of seller's products
- Edit/Delete buttons
- Product details
- Quick actions

### Settings Page
- Profile information
- Phone and address
- Account type
- Security settings
- Preferences
- Account management

---

## Troubleshooting

### Issue: API requests failing (CORS error)
**Solution**: Make sure the backend server is running and CORS is properly configured in `server/index.js`

### Issue: Database connection error
**Solution**: 
1. Check MySQL is running: `mysql -u root -p`
2. Verify credentials in `.env` file
3. Run `node init-db.js` again

### Issue: Products not loading
**Solution**:
1. Check if backend is running on port 4000
2. Run `node seed.js` to add sample data
3. Check browser console for errors

### Issue: Cart data not persisting
**Solution**: The cart is stored in browser localStorage. Check browser storage settings or try clearing cache.

---

## File Size & Performance

- CSS: ~50KB (fully inlined in main.css)
- JavaScript: ~80KB total (modular files)
- No external dependencies required (except API calls)
- Fully responsive and mobile-optimized
- Smooth animations and transitions

---

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Full support

---

## Key Technologies

**Frontend:**
- Vanilla HTML5
- Pure CSS3 (with CSS variables)
- Vanilla JavaScript (ES6+)
- LocalStorage API
- Fetch API

**Backend:**
- Node.js
- Express.js
- MySQL2
- CORS
- dotenv

---

## Development Notes

### Adding New Features

1. **New Page**: Create file in `styles/js/pages/`
2. **Register Route**: Add to `Router.register()` in `app.js`
3. **Create Render Function**: Named `render[PageName]Content(params)`
4. **Style**: Add CSS to `main.css`

### API Integration

All API calls go through the `API` class in `api.js`. To add new endpoint:

```javascript
static async newEndpoint(params) {
    try {
        const response = await fetch(`${API_BASE_URL}/route`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        return data;
    } catch (error) {
        throw error;
    }
}
```

### Utility Functions

Available in `utils.js`:
- `Storage` - LocalStorage management
- `showToast()` - Notifications
- `Router` - Client-side routing
- `Format` - Number/Date formatting
- `Auth` - Authentication helper
- `UI` - DOM manipulation
- `Validation` - Form validation

---

## License

This project is open source and available under the MIT License.

---

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review browser console for errors
3. Verify backend is running
4. Check database connection

---

## Future Enhancements

- Payment gateway integration (Stripe, PayPal)
- Email notifications
- Advanced search and filtering
- Product reviews and ratings
- Wishlist functionality
- Order tracking with real-time updates
- Admin dashboard
- Analytics and reporting
- Mobile app version

---

Made with ❤️ for Smart Agro
