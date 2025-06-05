import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import Home from "./pages/Home";
import RootLayout from "./layouts/RootLayout";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import UserProfile from "./pages/UserProfile";
//import Order from "./pages/Order";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="/user-profile/:userId/profile" element={<UserProfile />} />

        <Route path="/products" element={<Products />} />
        <Route path="/products/:name" element={<Products />} />
        <Route
          path="/products/category/:categoryId/products/"
          element={<Products />}
        />
        <Route
          path="/product/:productId/details"
          element={<ProductDetails />}
        />
        <Route path="/register" element={<Register />} />

        <Route path="/login" element={<Login />} />
        <Route path="/user/:userId/my-cart" element={<Cart />} />
        {/* <Route path='/user/:userId/my-orders' element={<Order />} /> */}
      </Route>
    )
  );

  return <RouterProvider router={router} />;
 
}

export default App;
