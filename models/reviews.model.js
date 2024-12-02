import mongoose from "mongoose";


const reviewSchema = new mongoose.Schema(
    {

        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product', 
            required: true,
        },
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'user', 
          required: true,
      },
        userName: {
            type: String,
            required: true,
 
        },
        reviewMessage: {
          type: String,
          default: 0,

      },
      reviewValue: {
        type: String,
      },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);


const review = mongoose.model('review', reviewSchema);
export default review;