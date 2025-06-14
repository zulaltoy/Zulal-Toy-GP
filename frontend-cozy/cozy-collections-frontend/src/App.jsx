import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import Home from "./pages/Home";
import RootLayout from "./layouts/RootLayout";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import UserProfile from "./pages/UserProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import UnauthorizedPage from "./utils/Unauthorized";
import Checkout from "./pages/Checkout";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY); 

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="/user-profile" element={<UserProfile />} />

        <Route path="/products" element={<Products />} />
        <Route path="/products/:name" element={<Products />} />
        <Route
          path="/products/category/:categoryId/products"
          element={<Products />}
        />
        <Route
          path="/product/:productId"
          element={<ProductDetails />}
        />
        <Route path="/register" element={<Register />} />

        <Route path="/login" element={<Login />} />
        
        <Route
          element={
            <ProtectedRoute
              useOutlet={true}
              allowedRoles={["ROLE_ADMIN", "ROLE_USER"]}
            />
          }>
          <Route path='/user/:userId/my-cart' element={<Cart />} />
          <Route
            path='/user-profile/:userId/profile'
            element={<UserProfile />}
          />
        </Route>

        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route
          path="/checkout/:userId/checkout"
          element={
            <Elements stripe={stripePromise}>
              <Checkout />
            </Elements>
          }
        />
        
      </Route>
    )
  );

  return <RouterProvider router={router} />;
 
}

export default App;
