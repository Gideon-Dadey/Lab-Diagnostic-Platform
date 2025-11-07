import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FiTrash2, FiPlus, FiMinus } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { setCart, updateQuantity, deleteItem } from "../../redux/CartSlice";

const CartSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentLabId = useSelector((state) => state.lab?.currentLabId);
  const cartItems = useSelector((state) => state.cart.items);
  const labCartItems = cartItems.filter((item) => item.labId === currentLabId);
  const total = labCartItems.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.cartItems)) {
        dispatch(setCart(data.cartItems));
      } else {
        toast.error(data.message || "Failed to load cart");
      }
    } catch (err) {
      console.error("Cart fetch error:", err);
      toast.error("Failed to fetch cart");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    if (isDeleting) return;
    setIsDeleting(true);
    
    try {
      const res = await fetch(`/api/cart/remove/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        dispatch(deleteItem(id));
        toast.success("Item removed from cart");
      } else {
        toast.error(data.message || "Failed to remove item");
      }
    } catch (error) {
      console.error("Remove item error:", error);
      toast.error("Error removing item");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleQuantityChange = async (id, type) => {
    const item = cartItems.find((i) => i._id === id);
    if (!item) {
      console.error("Item not found in cart:", id);
      return;
    }

    const newQty = type === "inc" ? item.quantity + 1 : Math.max(1, item.quantity - 1);

    try {
      const requestBody = {
        quantity: newQty
      };

      const res = await fetch(`/api/cart/quantity/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Server response:", {
          status: res.status,
          statusText: res.statusText,
          body: errorText
        });
        throw new Error(`Server returned ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      if (data.success) {
        dispatch(updateQuantity({ _id: id, quantity: newQty }));
      } else {
        toast.error(data.message || "Failed to update quantity");
      }
    } catch (err) {
      console.error("Update quantity error:", err);
      toast.error("Failed to update quantity");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) {
    return <p className="text-gray-600 mt-6">Loading cart...</p>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
        <span className="text-sm text-gray-500">{labCartItems.length} {labCartItems.length === 1 ? 'item' : 'items'}</span>
      </div>
      
      {labCartItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <p className="text-gray-600 font-medium mb-2">Your cart is empty</p>
          <p className="text-sm text-gray-500 mb-6">Add tests and packages to get started</p>

          <Link
            to="/labs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition"
          >
            Browse Labs
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {labCartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-primary/30 transition-colors bg-gray-50/50"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-600">
                    ${Number(item.price).toFixed(2)} × {item.quantity}
                  </p>
                </div>
                
                <div className="text-right mr-4">
                  <p className="font-bold text-lg text-gray-900">
                    ${(Number(item.price) * item.quantity).toFixed(2)}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuantityChange(item._id, "dec")}
                    disabled={isDeleting || item.quantity <= 1}
                    className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    aria-label="Decrease quantity"
                  >
                    <FiMinus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-semibold text-gray-900">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item._id, "inc")}
                    disabled={isDeleting}
                    className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    aria-label="Increase quantity"
                  >
                    <FiPlus className="w-4 h-4" />
                  </button>
                </div>
                
                <button
                  onClick={() => handleRemove(item._id)}
                  disabled={isDeleting}
                  className="p-2 rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  aria-label="Remove item"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-6 space-y-4">
            <div className="flex items-center justify-between text-lg">
              <span className="font-semibold text-gray-700">Total</span>
              <span className="font-bold text-2xl text-primary">${total.toFixed(2)}</span>
            </div>
            
            <button
              onClick={() => {
                setIsLoading(true);
                navigate("/place-order");
              }}
              disabled={isLoading || isDeleting}
              className={`w-full py-3.5 rounded-xl text-white font-semibold transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                isLoading || isDeleting
                  ? "bg-gray-400"
                  : "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Proceed to Checkout"
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartSection; 
