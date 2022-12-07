const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    typeProduct: {
        type: String,
        required: true
    },
    color: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    sizes: [{
        size: {
            type: String,
            required: true
        }
    }],
    description: {
        type: String,
        required: true
    },
    message: {
        type: String
    },
    imgDetails: [{
        color: {
            type: String
        },
        imgs: [
            {
                img: String
            }
        ]
    }],
    userCreated: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    status: {
        type: Number,
        require: false
    }
})

productSchema.methods.toJSON = function () {
    const product = this

    const productObject = product.toObject()
    delete productObject.__v
    delete productObject.sizes.map((item) => {
        return delete item._id
    })
    delete productObject.imgDetails.map((item) => {
        return item.imgs.map((i) => {
            return delete i._id
        })
    })
    return productObject
}

module.exports = mongoose.model("Product", productSchema)