// 1. Helper to get or create a User ID
function getUserId() {
  let userId = localStorage.getItem("parosa_user_id");
  if (!userId) {
    // Generate a random ID if one doesn't exist
    userId = 'guest_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("parosa_user_id", userId);
  }
  return userId;
}

// 2. The Main Function
export const addToCart = async (product) => {
  const userId = getUserId();

  try {
    const response = await fetch('http://localhost:5000/api/cart/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        product: product
      }),
    });

    if (response.ok) {
      alert("Item added to MongoDB Cart!");
    } else {
      alert("Failed to add item");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};