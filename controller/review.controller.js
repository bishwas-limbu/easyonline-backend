import product from '../models/product.model.js';
import review from '../models/reviews.model.js';
import user from '../models/user.model.js';


export const addReview = async (req, res) => {
  try {
    const { productId, userName, reviewMessage, reviewValue } = req.body;
    const userId = req.user.id;

    // Check if the user has already reviewed the product
    const existingReview = await review.findOne({ productId,userId});

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product!",
      });
    }

    // Create a new review
    const updatedReview = new review({
      productId,
      userId,
      userName,
      reviewMessage,
      reviewValue,
    });

    await updatedReview.save();

    // Calculate the average review value
    const reviews = await review.find({ productId });

    const totalReviewsLength = reviews.length;
    const reviewAverage = totalReviewsLength
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) / totalReviewsLength
      : 0; // Default to 0 if no reviews

    // Update the product with the new average review
    await product.findByIdAndUpdate(productId, { reviewAverage });

    res.status(201).json({
      success: true,
      data: updatedReview,
    });
  } catch (e) {
    console.error(e); // Log the error for debugging
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: e.message, // Include the error message for debugging
    });
  }
};

export const getReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await review.find({ productId }).populate('userId').populate('productId').exec();
    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (e) {
        console.error(e); // Log the error for debugging
        res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: e.message, // Include the error
        
        });
    }
}