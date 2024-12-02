import mongoose from "mongoose";


const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,

        },
        image : {
            type : Array,
            required: true,

        },
        description: {
            type: String,
            required: true,
  
        },
        price: { // Changed to lowercase
            type: Number,
            required: true,
            default: 0,
        },

        category: {
            type: String,
            required: true, 
            
        },

        subCategory:{
            type: String,
            required: true
        },
        sizes:{
            type: Array,
            required: true,
        },
        bestSeller:{
            type:Boolean,
            default:false,
        },
        date:{
            type:Number,
     
        }
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);


const product = mongoose.models.product ||mongoose.model('product', productSchema);
export default product;