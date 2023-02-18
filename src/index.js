import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "../node_modules/font-awesome/css/font-awesome.min.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import {
  Home,
  Dashboard,
  ContactPage,
  Login,
  Register,
  PageNotFound,
} from "./pages";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBS8-Ze5MDIKFVV5M21unYt54EFHMh9vnk",
  authDomain: "wingi-shop.firebaseapp.com",
  projectId: "wingi-shop",
  storageBucket: "wingi-shop.appspot.com",
  messagingSenderId: "513748102374",
  appId: "1:513748102374:web:c60e483650ebdbef355f27",
  measurementId: "G-WJNT22VDZP",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const storage = getStorage(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Get a list of cities from your database
export async function getCollections(db) {
  const citiesCol = collection(db, "collection");
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map((doc) => doc.data());
  return cityList;
}

export default getFirestore()

function App() {
  const [IsLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    // Add your side effects here, e.g.:
    // Fetch data from server
    // Attach event listeners
    // Any operation that can affect your component's state

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      user ? setIsLoggedIn(true) : setIsLoggedIn(false);
    });

    return () => {
      // Clean up function
      // Remove any event listeners or subscriptions
      unsubscribe();
    };
  }, []);

  return (
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {IsLoggedIn ? (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Dashboard" element={<Dashboard />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          ) : (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          )}
        </PersistGate>
      </Provider>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
