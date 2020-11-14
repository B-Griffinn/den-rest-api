// deno-lint-ignore-file
import { v4 } from 'https://deno.land/std/uuid/mod.ts'
import { Product } from '../types.ts'

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
const addProduct = async ({ request, response }: { request: any, response: any }) => {
    // capture the body of the incoming request aka the new product being added to our DB
    // body() method returns a promise which is why we need async await
    const body = await request.body()


    // check and ensure the user has provided the end point with the proper information
    if (!request.hasBody) {
        response.status = 400
        response.body = {
            success: false,
            message: 'Please provide the required information.'
        }
    } else {
        // get the type/value from the body for our product
        const newproduct: Product = await body.value
        // generate an id on the product so the user does not have to
        newproduct.id = v4.generate()
        // add the incoming body to the 'database' aka our products array
        products.push(newproduct)

        response.status = 201
        response.body = {
            success: true,
            data: newproduct
        }
    }

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