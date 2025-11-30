import express from 'express';
import cors from 'cors';
import supabase from './config/supabaseClient.js';

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// SIGNUP ROUTE
app.post('/api/users', async (req, res) => {
  try {
    console.log('Signup request received:', req.body);
    
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ 
        error: 'Please provide name, email, and password' 
      });
    }

    const { data: existingUser } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const { data, error } = await supabase
      .from('users')
      .insert([{ name, email, password }])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ 
      message: 'User created successfully', 
      user: {
        id: data[0].id,
        name: data[0].name,
        email: data[0].email
      }
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// LOGIN ROUTE
app.post('/api/login', async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Please provide email and password' 
      });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      console.log('User not found');
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log('User found, checking password...');

    if (password !== user.password) {
      console.log('Invalid password');
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log('Login successful');

    const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

    res.json({ 
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============ PRODUCT ROUTES ============

// CREATE - Add new product
app.post('/api/products', async (req, res) => {
  try {
    console.log('Add product request:', req.body);
    
    const { name, description, price, category, image_url, seller_name, contact, email, location, user_id } = req.body;

    if (!name || !price || !seller_name || !contact) {
      return res.status(400).json({ 
        error: 'Please provide name, price, seller name, and contact' 
      });
    }

    const { data, error } = await supabase
      .from('products')
      .insert([{ 
        name, 
        description, 
        price, 
        category, 
        image_url, 
        seller_name, 
        contact, 
        email,
        location,
        user_id
      }])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ 
      message: 'Product added successfully', 
      product: data[0]
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// READ - Get all products
app.get('/api/products', async (req, res) => {
  try {
    const { category, search, user_id } = req.query;

    let query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (user_id) {
      query = query.eq('user_id', user_id);
    }

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// READ - Get single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(404).json({ error: 'Product not found' });
  }
});

// UPDATE - Update product
app.put('/api/products/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(req.body)
      .eq('id', req.params.id)
      .select();

    if (error) throw error;

    res.json({ 
      message: 'Product updated successfully', 
      product: data[0]
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({ error: error.message });
  }
});

// DELETE - Delete product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({ error: error.message });
  }
});

// ============ MESSAGE ROUTES (WhatsApp-Style) ============

// CREATE - Send message
app.post('/api/messages', async (req, res) => {
  try {
    console.log('Send message request:', req.body);
    
    const { product_id, sender_id, receiver_id, sender_name, receiver_name, message } = req.body;

    if (!product_id || !sender_id || !receiver_id || !sender_name || !receiver_name || !message) {
      return res.status(400).json({ 
        error: 'Please provide all required fields' 
      });
    }

    const { data, error } = await supabase
      .from('messages')
      .insert([{ 
        product_id,
        sender_id,
        receiver_id,
        sender_name,
        receiver_name,
        message
      }])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ 
      message: 'Message sent successfully', 
      data: data[0]
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// READ - Get conversation between two users for a specific product
app.get('/api/messages/:product_id', async (req, res) => {
  try {
    const { user_id, other_user_id } = req.query;

    if (!user_id) {
      return res.status(401).json({ error: 'User ID required' });
    }

    console.log('Fetching messages for:', { product_id: req.params.product_id, user_id, other_user_id });

    // Get product to check if user is the seller
    const { data: product } = await supabase
      .from('products')
      .select('user_id, seller_name')
      .eq('id', req.params.product_id)
      .single();

    let query = supabase
      .from('messages')
      .select('*')
      .eq('product_id', req.params.product_id);

    // If user is the seller (product owner)
    if (product && product.user_id === user_id) {
      if (other_user_id) {
        // Seller viewing specific conversation with a buyer
        query = query.or(`and(sender_id.eq.${user_id},receiver_id.eq.${other_user_id}),and(sender_id.eq.${other_user_id},receiver_id.eq.${user_id})`);
      } else {
        // Seller viewing all messages (will show all conversations)
        query = query.or(`sender_id.eq.${user_id},receiver_id.eq.${user_id}`);
      }
    } else {
      // Buyer viewing conversation with seller
      const sellerId = product?.user_id;
      if (sellerId) {
        query = query.or(`and(sender_id.eq.${user_id},receiver_id.eq.${sellerId}),and(sender_id.eq.${sellerId},receiver_id.eq.${user_id})`);
      }
    }

    const { data, error } = await query.order('created_at', { ascending: true });

    if (error) throw error;

    console.log('Messages found:', data.length);
    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET - Get list of all buyers who messaged about this product (for seller)
app.get('/api/product/:product_id/buyers', async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(401).json({ error: 'User ID required' });
    }

    console.log('Fetching buyers for product:', req.params.product_id, 'user:', user_id);

    // Get all unique buyers who have messaged about this product
    const { data, error } = await supabase
      .from('messages')
      .select('sender_id, sender_name, receiver_id, receiver_name, created_at')
      .eq('product_id', req.params.product_id)
      .or(`sender_id.eq.${user_id},receiver_id.eq.${user_id}`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    console.log('All messages for product:', data.length);

    // Get unique buyers (exclude the seller)
    const buyersMap = new Map();
    
    data.forEach(msg => {
      const buyerId = msg.sender_id === user_id ? msg.receiver_id : msg.sender_id;
      const buyerName = msg.sender_id === user_id ? msg.receiver_name : msg.sender_name;
      
      if (buyerId !== user_id && !buyersMap.has(buyerId)) {
        buyersMap.set(buyerId, {
          id: buyerId,
          name: buyerName,
          last_message_time: msg.created_at
        });
      }
    });

    const buyers = Array.from(buyersMap.values());
    console.log('Unique buyers:', buyers.length);

    res.json(buyers);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET - Get all conversations for a user (list of people they've chatted with)
app.get('/api/conversations/:user_id', async (req, res) => {
  try {
    const userId = req.params.user_id;

    // Get all unique conversations (product + other user combinations)
    const { data, error } = await supabase
      .from('messages')
      .select('product_id, sender_id, receiver_id, sender_name, receiver_name, created_at')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Group by conversation (product_id + other_user_id)
    const conversations = {};
    
    data.forEach(msg => {
      const otherUserId = msg.sender_id === userId ? msg.receiver_id : msg.sender_id;
      const otherUserName = msg.sender_id === userId ? msg.receiver_name : msg.sender_name;
      const key = `${msg.product_id}_${otherUserId}`;
      
      if (!conversations[key]) {
        conversations[key] = {
          product_id: msg.product_id,
          other_user_id: otherUserId,
          other_user_name: otherUserName,
          last_message_time: msg.created_at
        };
      }
    });

    res.json(Object.values(conversations));
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET ALL USERS
app.get('/api/users', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 404 handler
app.use((req, res) => {
  console.log('404 - Route not found:', req.method, req.url);
  res.status(404).json({ error: 'Route not found' });
});

const port = 5000;
app.listen(port, () => {
  console.log(`=================================`);
  console.log(`Server listening on port ${port}`);
  console.log(`API available at http://localhost:${port}`);
  console.log(`=================================`);
});
