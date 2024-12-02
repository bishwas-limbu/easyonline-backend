import Product from '../models/product.model.js'; // For validation
import {PutObjectCommand,DeleteObjectCommand} from '@aws-sdk/client-s3';
import crypto from 'crypto';
import {s3Client} from '../utils/utils.s3.client.js';
import config from '../config/config.js'



const uniqueImageName = (bytes = 32) =>crypto.randomBytes(16).toString('hex');

// const storage = multer.memoryStorage(); // Creating memory storage
// const upload = multer({ storage: storage }); // Storing images in memory, not on disk



// Get all products
export const getAllProducts = async (req, res) => {
    try {

        const productList = await Product.find({});

        if (productList.length > 0) {
            res.status(200).json({ 
                success: true, 
                data: {
                    productList,
                },
             });
        } else {
            res.status(404).json({ success: false, message: 'No Product List found' });
        }
    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        res.status(500).json({ success: false, message: error});
    }
}

// Create a new product
export const addProduct = async (req, res) => {

        try {
            const {title, description, price, category,subCategory,sizes, bestSeller} = req.body;
            if (!title || !description || !price || !category || !subCategory || !sizes) {
                return res.status(400).json({ success: false, message: 'All fields are required' });
            }
            if(!req.file){
                return res.status(400).json({ success: false, message: 'Image is required to add product.'});
            }

            let imageUrl = '';
            const imageName = uniqueImageName();


            // Create a new product
            const newProduct = new Product({
                title: title,
                description: description,
                price: Number(price),
                category: category,
                subCategory:subCategory,
                sizes: sizes.split(','),
                bestSeller,
                date:Date.now()
            });

            if(req.file){
                

                console.log("Image name",imageName);
    
                console.log(req.file);
    
                const params ={
                    Bucket : config.BUCKET_NAME,
                    Key: imageName,
                    Body: req.file.buffer,
                    ContentType : req.file.mimetype,      
                };
    
                console.log("Params for S3",params);
                await s3Client.send(new PutObjectCommand(params)); 
    
                imageUrl = `https://${config.BUCKET_NAME}.s3.${config.BUCKET_REGION}.amazonaws.com/${imageName}`
            } 

            
        // Set the image property on the newProduct
             newProduct.image = imageUrl ? [imageUrl, imageName] : [];
            // Save the product to the database
            await newProduct.save();
            res.status(201).json({ success: true, data: newProduct, message:"Product add successfully" });

        } catch (error) {
            console.error(error); // Log the error for debugging purposes
            return res.status(501).json({ success: false, message: error.message});
        }
    }


export const getProductById = async(req, res)=>{
    try {
        const productId = req.params.id;
        console.log(productId);
        const product = await Product.findById({_id:productId});
        console.log(product);

        if(product){
            
            return res.status(200).send(product);
        } else {
            res.status(500).json({message: "The product with provided ID was not found"});
        }
    }catch (error){
        console.error(error); // Log the error for debugging purposes
        res.status(500).json({ success: false, message: 'Internal server error' });
    }

}

export const delProductById = async(req, res)=>{
    try {
        const productId = req.params.id;
        console.log(productId);

        const product = await Product.findOneAndDelete({_id:productId});
        console.log(product);
        if (product){
            const deleteParams = {
                Bucket : config.BUCKET_NAME,
                Key : product.image[1],
            };
    
            await s3Client.send(new DeleteObjectCommand(deleteParams));
            res.status(200).json({success : true, message : 'product is deleted successfully!'});
        } else{
            res.status(404).json({success : false,message: "No match found !!!"});
        }

    }catch (error){
        console.error(error); // Log the error for debugging purposes
        res.status(500).json({ success: false, message: error.message });
    }

}


export const updateProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const {title, description, price, category,subCategory,sizes, bestSeller} = req.body;

        console.log("file image ", req.file);
                  
        // Find the existing Prodcut
        const existingProduct = await Product.findById(productId);
        console.log("existingproduct",existingProduct);
        if (!existingProduct) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        } else {

            // Generate a unique key for the new image
            const newImageName = uniqueImageName();

            let newImageUrl = '';
            
            // If a new image is provided, handle the image upload
            if (req.file) {
                // Generate a unique key for the new image
               // const newImageName = uniqueImageName();
                const params = {
                    Bucket: config.BUCKET_NAME,
                    Key: newImageName,
                    Body: req.file.buffer,
                    ContentType: req.file.mimetype,
                };
                console.log("image params",params);
                // Upload the new image to S3
                await s3Client.send(new PutObjectCommand(params));
                console.log("1");
                // Delete the old image from S3
                if (existingProduct.image && existingProduct.image[1]) {
                    const deleteParams = {
                    Bucket: config.BUCKET_NAME,
                    Key: existingProduct.image[1], // Assuming the second element is the image key
                };
                await s3Client.send(new DeleteObjectCommand(deleteParams));
             }
                

                console.log("2");
                // Update the image URL in the update data
                newImageUrl = `https://${config.BUCKET_NAME}.s3.${config.BUCKET_REGION}.amazonaws.com/${newImageName}`;
            }  
                                // Prepare the new data
                const updateProduct = {

                    title: title || existingProduct.title,
                    description: description || existingProduct.description,
                    price: price || existingProduct.price,
                    category: category || existingProduct.category,
                    subCategory: subCategory ||  existingProduct.subCategory,
                    sizes: sizes ||  existingProduct.sizes,
                    image: newImageUrl ? [newImageUrl,newImageName] : existingProduct.image,
                    date: Date.now()

                };
                // Update the Product in MongoDB
            await Product.findByIdAndUpdate(productId, updateProduct, { new: true });
            return res.status(200).json({ success: true, message: 'Product updated successfully' });

        }

    } catch (error) {
        console.error('Error updating Product:', error);
        res.status(500).json({ success: false, message: 'Failed to update Product' });
    }
}
