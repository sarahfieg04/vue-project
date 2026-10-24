import express from 'express'; 
import 'dotenv/config';
import {MongoClient} from 'mongodb'; 
import {cartItems as cartItemsRaw, products as productsRaw } from './temp-data'; 
console.log('URI is:', process.env.MONGODB_URI);

let cartItems = cartItemsRaw; 
let products = productsRaw; 

const url = process.env.MONGODB_URI;
const client = new MongoClient(url);

const app = express(); 
app.use(express.json()); 


// sever endpoint 
app.get('/hello', async (req, res) => {
    await client.connect(); 
    const db = client.db('vue-lll-db'); 
    const products = await db.collection('products').find({}).toArray(); 
    res.send(products); 
}); 

// front-end endpoint
app.get('/products', (req, res) => {
    res.json(products); 
});

function populateCartIds(ids) {
    return ids.map(id => products.find(product => product.id === id)); 
}

app.get('/cart', (req, res) => {
    const populatedCart = populateCartIds(cartItems); 
    res.json(populatedCart);
}); 

app.get('/products/:productId', (req, res) => {
 const productId = req.params.productId; 
 const product = products.find(product => product.id === productId); 
 res.json(product); 
}); 

//loading cart item 
app.post('/cart', (req, res) => {
    const productId = req.body.id; 
    cartItems.push(productId); 
    const populatedCart = populateCartIds(cartItems);
    res.json(populatedCart); 
});

// delete endpoint 
app.delete('/cart/:productId', (req, res) => {
    const productId = req.params.productId; 
    cartItems = cartItems.filter(id => id !== productId);
    const populatedCart = populateCartIds(cartItems); 
    res.json(cartItems); 
});

// setup port 
app.listen(8000, () => {
    console.log('Server is listening on port 8000')
}); 