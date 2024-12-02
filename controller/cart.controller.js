//import cart from "../models/cart.model.js";
import user from '../models/user.model.js';
//import product from "../models/product.model.js";
//import subTotal from '../utils/subtotal.js';





// get all cart item for user
export const getCart = async (req, res) => {
    //console.log(req.query.user);
    try {
        const userId = req.user._id;
        
        const user_Data = await user.findById({_id:userId});

        let cart_Data = await user_Data.cartData;

        if (cart_Data.length < 0) { // Check if cartList is empty
            return res.status(404).json({ message: "Cart not added" });
        } else {

            return res.status(200).json({
                success: true,
                data: cart_Data,
            });
        }

    } catch (err) {
        res.status(500).json({ success: false, message: err.message }); // More specific error message
    }
};


//content type - applications/json 
// adding cart item
export const addToCart = async (req, res) => {

    

    const productId = req.body.itemId;
    const sizes = req.body.size;
   // const quantity = req.body.quantity;

    const userId = req.user._id;
     console.log("userId",userId);  
     console.log("prouduct",productId,"size",sizes)

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    try {

      const user_Data = await user.findById({_id:userId});

      if (!user_Data) {
        return res.status(404).json({
          success: false,
          message: "user not found",
        });
      }
    
      let cart_Data = await user_Data.cartData;

      console.log("1",cart_Data);

      if (cart_Data[productId]) {
          if(cart_Data[productId][sizes]){
              cart_Data[productId][sizes] += 1;
          }else{
            cart_Data[productId][sizes] = 1;
          }
        
      }else{
        cart_Data[productId] = {};
        cart_Data[productId][sizes] = 1;
      }
      
      console.log("2",cart_Data);
     const updateUser =  await user.findByIdAndUpdate({_id:userId}, {$set:{cartData:cart_Data}});
console.log("3",updateUser)
      res.status(201).json({success : true , message: 'Item added to cart successfully'});

    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
      console.log(error)
    }
};
  
  
export const delCart = async(req,res)=>{
  
  try{
    const productId = req.body.itemId;
    const sizes = req.body.size;
    const userId = req.user._id;

    console.log("delete product id",productId);
    console.log("delete suer ID",userId);

    const user_Data = await user.findById({_id:userId});

    

    res.status(200).json({success : true, data: cart_, message: 'Cart item deleted successfully'});

  }catch(error){
    return res.status(500).json({ success: false, message: error.message});
  }
}

export const updateCart = async (req, res) => {
  try{
   // const {productId,sizes,quantity} = req.body;
   const productId = req.body.itemId;
   const sizes = req.body.size;
   const quantity = req.body.quantity;

    const userId = req.user._id;

    console.log("update productID",productId);
    console.log("update quantity",quantity);
    console.log("update user ID",userId);
    console.log('sizes',sizes);

    const user_Data = await user.findById({_id:userId});

    let cart_Data = await user_Data.cartData;

    cart_Data [productId][sizes] = quantity;
    
    await user.findByIdAndUpdate({_id:userId}, {$set:{cartData:cart_Data}});


    res.status(200).json({success : true,message: 'Cart item updated successfully',});
  } catch(error){
    console.log("errorMessage : ",error.message);
    res.status(500).json({ success: false, message: error.message });
  }
}