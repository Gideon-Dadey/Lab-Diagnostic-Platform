import { Cart } from '../models/order.model.js';

export const addToCart = async (req, res) => {
  try {
    const { testOrPackageId, type, name, price, labId, quantity = 1 } = req.body;
    const userId = req.user.id;

    // Find existing item
    const existing = await Cart.findOne({ userId, testOrPackageId });
    
    if (existing) {
      // Update quantity if item exists
      existing.quantity += quantity;
      await existing.save();
      return res.status(200).json({ 
        success: true, 
        itemId: existing._id, 
        cartItem: existing,
        message: "Item quantity updated in cart"
      });
    }

    // Create new cart item if it doesn't exist
    const numericPrice = Number(price) || 0;
    const numericQty = Math.max(1, Number(quantity) || 1);
    const cartDoc = {
      userId,
      testOrPackageId,
      type,
      name,
      price: numericPrice,
      quantity: numericQty
    };
    // Only set labId if it's a valid ObjectId; otherwise omit to avoid validation error
    try {
      const mongoose = (await import('mongoose')).default;
      if (labId && mongoose.Types.ObjectId.isValid(labId)) {
        cartDoc.labId = labId;
      }
    } catch {}

    const newCartItem = new Cart(cartDoc);

    await newCartItem.save();
    res.status(201).json({ 
      success: true, 
      itemId: newCartItem._id, 
      cartItem: newCartItem,
      message: "Item added to cart"
    });
  } catch (error) {
    console.error("Add to cart error:", error.message);
    res.status(500).json({ 
      success: false, 
      message: "Server error",
      error: error.message 
    });
  }
};

export const getUserCart = async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.user.id });
    res.status(200).json({ success: true, message: "Cart items fetched successfully", cartItems });
  } catch (error) {
    console.error("Fetch cart error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

export const getCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Lazy import mongoose to avoid circular deps
    const mongoose = (await import('mongoose')).default;

    let cartItem;
    if (mongoose.Types.ObjectId.isValid(id)) {
      cartItem = await Cart.findOne({ _id: id, userId });
    } else {
      // Fallback: treat id as a business identifier (e.g., slug) stored in testOrPackageId
      cartItem = await Cart.findOne({ testOrPackageId: id, userId });
    }
    if (!cartItem) {
      return res.status(404).json({ success: false, message: "Cart item not found" });
    }
    res.status(200).json({ success: true, message: "Cart item fetched successfully", cartItem });
  } catch (error) {
    console.error("Get cart item error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const mongoose = (await import('mongoose')).default;

    let deletedItem;
    if (mongoose.Types.ObjectId.isValid(id)) {
      deletedItem = await Cart.findOneAndDelete({ _id: id, userId });
    } else {
      // If not a valid ObjectId, assume it's the domain identifier stored in testOrPackageId
      deletedItem = await Cart.findOneAndDelete({ testOrPackageId: id, userId });
    }

    if (!deletedItem) {
      return res.status(404).json({ success: false, message: "Cart item not found" });
    }

    res.status(200).json({ success: true, message: "Item removed from cart successfully" });
  } catch (error) {
    console.error("Remove cart item error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    await Cart.deleteMany({ userId: req.user.id });
    res.status(200).json({ success: true, message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Clear cart error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;


    if (!quantity || isNaN(quantity) || quantity < 1) {
      return res.status(400).json({ 
        success: false, 
        message: "Quantity must be a number greater than 0" 
      });
    }

  
    const mongoose = (await import('mongoose')).default;

    const filter = mongoose.Types.ObjectId.isValid(id)
      ? { _id: id, userId }
      : { testOrPackageId: id, userId };

    const updatedItem = await Cart.findOneAndUpdate(
      filter,
      { quantity },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ 
        success: false, 
        message: "Cart item not found or doesn't belong to user" 
      });
    }

    res.status(200).json({
      success: true,
      message: "Quantity updated successfully",
      updatedItem
    });

  } catch (error) {
    console.error("Update cart item error:", error.message);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error",
      error: error.message 
    });
  }
};