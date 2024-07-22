const clientsService = require('../services/clients');
// const loginController = require('./login');
const productsService = require('../services/products');
const ticketsService = require('../services/tickets');

async function getClientsPage(req, res) {
    try {

        const clientsInfo = await clientsService.getClientsFromDB()
        // const cartItems = await getCartItems(req,res) 
        // res.render('clients.ejs', { clients: clientsInfo, cartItems })

        // clientsInfo.forEach(client => {
        //     // console.log('client:', client)
        //     return client.orders?.forEach(order => {
        //         console.log('order:', order)
        //         return order?.forEach(item=> productsService.getProductById(item.id))
        // })
        // })

        res.render('clients.ejs', { clients: clientsInfo })
    } catch (e) {
        console.error('Error fetching clients:', e)
        res.status(500).send('Internal Server Error')
    }
}

async function getClientOrders(req, res) {
    const id = req.params.id
    try {
        // Send the client id to the client service, and get back the orders
        const ordersFromDB = await clientsService.getOrdersFromDB(id)
        // console.log('ordersFromDB:', ordersFromDB)
        
        let sum = 0
        let orders = []
        // Go over the orders from the DB
        for (let i = 0; i < ordersFromDB?.length; i++) {
            // Get the first order 
            orderFromDB = ordersFromDB[i]
            let order =[]
            // Go over the product ids in this order list, and get product specifics
            for (let j = 0; j < orderFromDB?.length; j++) {
                itemId = orderFromDB[j]?.id
                itemType = orderFromDB[j]?.type 
                let item = {}
                if(itemType === "ticket"){
                    item.productInfo = await ticketsService.getTicketById(itemId)
                    item.imgs = [item.productInfo.opImg]
                } else{
                    item.productInfo = await productsService.getProductById(itemId)
                    item.imgs = item.productInfo.srcImg
                    // console.log('here2:')
                }
                // console.log(' orderFromDB[j]?.size:',  orderFromDB[j].size)
                item.size = orderFromDB[j]?.size
                item.type = orderFromDB[j]?.type + 's'
                // console.log('item:', item)
                order.push(item)
                sum += item?.price || 0
            }
            orders.push(order)
        }

        orders.totalAmount = sum
        // Send back to the ajax req, a res with the orders 
        res.json(orders)
    }
    catch (e) {
        res.json(e)
    }

}

// async function getCartItems(req,res){ 
//     try { 
//         const username = loginController.getUsername(req, res) 
//         return await clientsService.getCartItemsFromDB('lihideshe') 
//         // return await clientsService.getCartItemsFromDB(username) 

//     } catch (e) { 

//         console.error('Error fetching clients:', e);
//     }
// } 


const deleteClient = async (req, res) => {
    try { 

      // Get the products id from the params in the web path 
      // and send it to the service file 9there it will delete the product in DB)
      const client = await clientsService.deleteClient(req.params.id)
      // If the product wasnt found in DB show an error
      if (!client) {
        res.status(404).json({ errors: ['client not found'] })
      } else {
        res.json(client)
      }
    } catch (e) {
      res.json("Client wasn't deleted successfully" + e)
    }
  }

const blockClient = async (req, res) => { 
    console.log("in cont")
    try {
        const id = req.params.id;
        const { isBanned } = req.body;

        await clientsService.blockClient(id , isBanned)

    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = {
    getClientsPage,
    getClientOrders, 
    deleteClient, 
    blockClient 

};
