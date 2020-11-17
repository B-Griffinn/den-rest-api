import { Client } from 'https://deno.land/x/postgres/mod.ts'
import { v4 } from 'https://deno.land/std/uuid/mod.ts'
import { Product } from '../types.ts'
import {dbCreds} from '../config.ts'


// create our denon client / init client
const client = new Client(dbCreds)

let products: Product[] = [ 
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

    // single out the product from the body
    const product = body.value



    // check and ensure the user has provided the end point with the proper information
    if (!request.hasBody) {
        response.status = 400
        response.body = {
            success: false,
            message: 'Please provide the required information.'
        }
    } else {
        try {
            // connect to our db to make queries
            await client.connect()
           const result = await client.query("INSERT INTO products(name, description, price) VALUES($1, $2, $3)", 
           product.name,
           product.description,
           product.price)

           response.status = 201
           response.body = {
               success: true,
               data: product
           }
       } catch (error) {
           response.status = 500
           response.body = {
               success: false,
               message: `SERVER ERROR ${error}`
           }
       } finally {
           await client.end()
       }
    }
}   

// @description    UPDATE product
// @route          PUT /api/v1/products/:id
const updateProduct = async ({ params, request, response }: { params: { id: string }, request: any, response: any }) => {
    // get product through our paramas
    const product: Product | undefined = products.find(p => p.id === params.id)

    // if the product id exists then let's updateProduct
    if (product) {
        // get new data from the body
        const body = await request.body()

        // udpated body comes from body.value
        // whatever is sent will be put in the `udpateData` variable below
        // allow name to be neglected
        const updateData: { name?: string; description: string; price: number } = await body.value

        // map through our products array and udpate the correct product based off ID with our variable above 
        products = products.map(p => p.id === params.id ? {
            ...p, 
            ...updateData
        } : p )
        response.status = 200
        response.body = {
            success: true,
            data: products
        }
    } else {
        response.status = 404
        response.body = {
            success: false,
            message: `The product id ${params.id} does not exist.`
        }
    }
}

// @description    DELETE product
// @route          DELETE /api/v1/products/:id
const deleteProduct =  ({ params, response }: { params: { id: string }, response: any }) => {

    // check if the item exists before deleting by looking for it
    const product: Product | undefined = products.find(p => p.id === params.id)

    // if id is found then we run the delete otherwise 404 does not exist
    if (product) {       
        products = products.filter(p => p.id !== params.id)
        response.status = 200
        response.body = {
            success: true,
            msg: `Product with id ${params.id} has been deleted`
        }
    } else if (!product) {
        response.status = 404
        response.body = {
            success: false,
            message: `The product id ${params.id} does not exist.`
        }
    } else {
        // if IF statements do not pass
        response.status = 500
        response.body = {
        success: false,
        message: 'Internal Server error'
        }
    }
}




export { getProducts, getProduct, addProduct, updateProduct, deleteProduct }