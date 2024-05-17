const Product = require('../models/products');

const createProduct = async (title ="", color="", cat="", price=0, gender="", favePlayer="", srcImg=[], sizes=[]) => {
    // Product.init() // Document gets generated (and gets an id)

    const product = new Product({
        title,
        color,
        cat,
        srcImg,
        favePlayer,
        price,
        gender,
        sizes
    })
// console.log('product:', product)
    return await product.save();
}

const getProductById = async (id) => {
    return await Product.findById(id);
}

const getProducts = async () => {
    return await Product.find({});
};

const updateProduct = async (title ="", color="", cat="", price=0, gender="", favePlayer="", srcImg=[], sizes) => {
    const product = await getProductById(id);
    if (!product)
        return null;

    
    product.title = title
    product.color = color
    product.price = price
    product.title = title
    product.gender = gender
    product.favePlayer = favePlayer
    product.srcImg = srcImg
    product.sizes = sizes
    // await product.save()
    return product
}

const deleteProduct = async (id) => {
    const product = await getProductById(id);
    if (!product)
        return null;

    await product.remove();
    return product;
};

module.exports = {
    createProduct,
    getProductById,
    getProducts,
    updateProduct,
    deleteProduct
}

