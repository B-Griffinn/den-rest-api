// deno-lint-ignore-file
import {Product} from '../types.ts'

const products: Product[] = [ 
    {
        id: '1',
        name: 'P1',
        description: 'P description 1',
        price: 19.99,
    },
    {
        id: '2',
        name: 'P2',
        description: 'P2 description',
        price: 29.99,
    },
    {
        id: '3',
        name: 'P3',
        description: 'P3 description',
        price: 39.99,
    },
]

// @description    GET all products
// @route          GET /api/v1/products
const getProducts = ({ response }: { response: any }) => {
    response.body = {
        success: true,
        data: products,
    }
}


// @description    GET a product
// @route          GET /api/v1/products/:id
const getProduct = ({ params, response }: { params: {id : string}, response: any }) => {
    // create a TS var that can be our Product or undefined
    // use HOM .find() to locate the given id in the params
    const product: Product | undefined = products.find(p => p.id === params.id)

    // check if the product id exists
    if (product) {
        response.status = 200
        response.body = {
            success: true,
            data: product
        }
    } else {
        response.status = 404
        response.body = {
            success: false,
            message: 'That product id does not exist'
        }
    }
}

// @description    ADD product
// @route          POST /api/v1/products
const addProduct = ({ response }: { response: any }) => {
    response.body = 'ADD'
}

// @description    UPDATE product
// @route          PUT /api/v1/products/:id
const updateProduct = ({ response }: { response: any }) => {
    response.body = 'UPDATE'
}

// @description    DELETE product
// @route          DELETE /api/v1/products/:id
const deleteProduct = ({ response }: { response: any }) => {
    response.body = 'DELETE'
}

export { getProducts, getProduct, addProduct, updateProduct, deleteProduct }