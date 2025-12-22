// 1. Import the specific Firebase tools we need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, setDoc, updateDoc, arrayUnion, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// 2. PASTE YOUR CONFIG HERE (From Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyBUkYqw-pQaGdGIZ5MvUo5pZwrJtvGTbpc",
  authDomain: "parosa-web.firebaseapp.com",
  projectId: "parosa-web",
  storageBucket: "parosa-web.firebasestorage.app",
  messagingSenderId: "519204799462",
  appId: "1:519204799462:web:eebacb9ab725136ed04c27",
  measurementId: "G-R4ZM8ZV7BB"
};

// 3. Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// 4. The "Magic" Function: Authenticate Guest silently
// This runs as soon as the file loads to ensure we have a User ID
let currentUser = null;

signInAnonymously(auth)
  .then(() => {
    console.log("Secure guest session established.");
  })
  .catch((error) => {
    console.error("Error signing in anonymously:", error);
  });

// Keep track of who is logged in
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    console.log("User ID:", user.uid);
  }
});

// 5. The Main Function: Add to Cart
export async function addToCart(product) {
  if (!currentUser) {
    alert("Still connecting to secure server... try again in a second.");
    return;
  }

  const cartRef = doc(db, "carts", currentUser.uid);

  try {
    const cartSnap = await getDoc(cartRef);

    if (cartSnap.exists()) {
      // If cart exists, add to it
      await updateDoc(cartRef, {
        items: arrayUnion({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1
        })
      });
    } else {
      // If no cart, create one
      await setDoc(cartRef, {
        items: [{
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1
        }],
        created: new Date()
      });
    }
    alert("Item added to cart!");
  } catch (e) {
    console.error("Error adding item: ", e);
    alert("Could not save to database.");
  }
}