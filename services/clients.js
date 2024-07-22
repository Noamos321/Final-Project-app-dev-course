const mongoose = require('mongoose');
const Client = require('../models/clients');

async function getClientsFromDB() {
    try {
        const clientsFromDB = await Client.find({});
        return clientsFromDB;
    } catch (e) {
        console.error('Error fetching clients from DB:', e);
    }
}

async function getCartItemsFromDB(username) {
    try {
        const client = await Client.findOne({ username });
        if (!client) {
            throw new Error('Client not found');
        }
        return client.cartItems;
    } catch (e) {
        console.error('Error fetching cart items from DB:', e);
        throw e;
    }
}

async function addCartItemToDB(username, productId, size, quantity) {
    try {
        console.log('Adding item to cart for user:', username);
        console.log('Quantity to add:', quantity);
        const client = await Client.findOne({ username });
        if (!client) {
            throw new Error('Client not found');
        }

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            throw new Error('Invalid product ID');
        }

        const productObjectId = mongoose.Types.ObjectId(productId);
        console.log('productObjectId:', productObjectId)
       
        const existingCartItem = client.cartItems.find(item => item.id.equals(productObjectId) && item.size === size);

        if (existingCartItem) {
            existingCartItem.quantity += parseInt(quantity, 10);
        } else {
            client.cartItems.push({ id: productObjectId, size, quantity: parseInt(quantity, 10), type: 'product' });
        }

        await client.save();
        console.log('Item added to cart successfully');
        return { success: true, message: 'Product added to cart successfully' };
    } catch (e) {
        console.error('Error adding item to cart:', e);
        return { success: false, message: 'Error adding item to cart' };
    }
}

async function removeCartItemFromDB(username, productId, size) {
    try {
        const client = await Client.findOne({ username });
        if (!client) {
            console.error('Client not found:', username);
            return { success: false, message: 'Client not found' };
        }

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return { success: false, message: 'Invalid product ID' };
        }

        const productObjectId = mongoose.Types.ObjectId(productId);
        const cartItemIndex = client.cartItems.findIndex(item => item.id.equals(productObjectId) && item.size === size);

        if (cartItemIndex > -1) {
            client.cartItems.splice(cartItemIndex, 1); // Remove the item
            await client.save();
            console.log('Item removed from cart successfully');
            return { success: true, message: 'Product removed from cart successfully' };
        } else {
            console.error('Item not found in cart:', productId);
            return { success: false, message: 'Item not found in cart' };
        }
    } catch (e) {
        console.error('Error removing item from cart:', e);
        return { success: false, message: 'Error removing item from cart' };
    }
}

async function getOrdersFromDB(id) {
    try {
        const client = await Client.findById(id);
        return client?.orders;
    } catch (e) {
        console.log('e:', e);
    }
}
async function addCartToOrders(username) {
    try {
        console.log('Adding cart to orders for user:', username);
        const client = await Client.findOne({ username });
        if (!client) {
            console.error('Client not found:', username);
            throw new Error('Client not found');
        }

        // const getOrdersById = async (id) => {
        //     return await orders.findById(id)
        // }

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            throw new Error('Invalid product ID');
        }

        const productObjectId = mongoose.Types.ObjectId(productId);
        client.cartItems = client.cartItems.filter(item => !item.id.equals(productObjectId));
        await client.save();
        console.log('Cart added to orders successfully');
        return { success: true, message: 'Cart added to orders successfully' };
    } catch (e) {
        console.error('Error adding cart to orders:', e);
        return { success: false, message: 'Error adding cart to orders' };
    }
}

// async function getCartItemsFromDB(username) {
//     try {
//         const client = await Client.findOne({ username })
//         if (!client) {
//             throw new Error('Client not found')
//         }
//         console.log('Client cart items:', client.cartItems)
//         return client.cartItems;
//     } catch (e) {
//         console.error('Error fetching cart items from DB:', e);
//         throw e;
//     }
// }

async function getClientByUsername(username) {
    try {
        const client = await Client.findOne({ username });
        return client
    } catch (e) {
        console.error('Error fetching client by ID:', e);
        throw e
    }
}

async function getStats() {
    try {
        // Client.aggregate([{
        //     $match : { $and : [ {owner: userId}, {date: { $gte: start, $lt: end } }] },
        // },{
        //     $group : {
        //         _id : null,
        //         total : {
        //             $sum : "$amount"
        //         }
        //     }
        // }],callback)

        // const data = await Client.aggregate([
        //     {
        //       $group: {
        //         _id: '$category',
        //         count: { $sum: 1 } // this means that the count will increment by 1
        //       }
        //     }
        //   ]);


        const data = await Client.aggregate(
            [
                {
                    $match: {
                        "dateCreated": {
                            $exists: true,
                            $ne: null
                        }
                    }
                },
                {
                    $group:
                    {
                        _id: { year: { $year: "$dateCreated" } },
                        count: { $sum: 1 }
                    }

                }
                , {
                    $sort: { "_id.year": -1 }
                }
            ]
        )
        console.log('data clients:', data)
        return data
    } catch (e) {
        console.log('e:', e)
    }
}

module.exports = {
    getCartItemsFromDB,
    getClientsFromDB,
    removeCartItemFromDB,
    addCartItemToDB,
    getOrdersFromDB,
    getClientByUsername,
    getStats,
    addCartToOrders 
}
 
