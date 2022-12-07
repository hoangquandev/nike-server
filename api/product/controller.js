import Product from './../../db/models/product'

// Show all products
export const index = async (req, res) => {
    const hasQuery = Object.keys(req.query).length
    const { gender, typeProduct } = req.query
    if (hasQuery) {
        try {
            if (hasQuery > 1) {
                const productFound = await Product.find({ $and: [{ gender }, { typeProduct }] })
                return res.status(200).send(productFound)
            }
            const productFound = await Product.find({ $or: [{ gender }, { typeProduct }] })
            return res.status(200).send(productFound)
        } catch (error) {
            return res.status(404).send('Not Found')
        }
    }
    // show all products
    const product = await Product.find({})
    return res.status(200).send(product)
}

// Show product by ID
export const show = async (req, res) => {
    const query = { _id: req.params.id }
    try {
        const product = await Product.findById(query);
        if (!product) {
            return res.status(404).send(`No product found ${query._id}`);
        }
        return res.send(product).status(200);
    } catch (e) {
        return res.status(500).send();
    }
}

// Create a new product
export const create = async (req, res, next) => {
    const product = new Product({ ...req.body })

    try {
        await product.save()
        return res.status(201).send({ product, message: "create product success" })
    } catch (error) {
        return res.status(400).send(error)
    }
}

// Update a product
export const update = async (req, res) => {
    const { name, description, gender, typeProduct, price, message, sizes, color, imgDetails, img, status } = req.body
    const filter = { _id: req.body._id }
    // update anh nên handle field ở FE send lên response field nào ko hợp lệ
    const newData = {
        $set: {
            name,
            description,
            gender,
            typeProduct,
            price,
            message,
            sizes,
            color,
            imgDetails,
            img,
            status
        }
    }
    const options = {}

    await Product.findOneAndUpdate(filter, newData, options)
        .then(updatedData => {
            if (updatedData) {
                res.status(200).send("Product successfully updated!")
            } else {
                res.status(400).send("No document matches the provided query.")
            }
            return updatedData
        })
        .catch(err => res.status(400).send(`Failed to find and update document: ${err}`))
}

// Delete a product
export const remove = async (req, res) => {
    const query = { _id: req.body._id }
    await Product.deleteOne(query, (err, result) => {
        if (err) throw err
        return res.status(200).send('Product deleted successfully!')
    })
}

// get product's categories
export const categories = async (req, res) => {
    await Product.distinct('typeProduct', (err, resp) => {
        if (err) throw err;
        return res.status(200).send(resp)
    })
}

// get product's gender
export const genders = async (req, res) => {
    await Product.distinct('gender', (err, resp) => {
        if (err) throw err;
        return res.status(200).send(resp)
    })
}