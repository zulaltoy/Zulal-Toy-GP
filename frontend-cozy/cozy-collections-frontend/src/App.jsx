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

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:name" element={<Products />} />
        <Route
          path="/products/category/:categoryId/products/"
          element={<Products />}
        />
        <Route
          path='/product/:productId/details'
          element={<ProductDetails />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='/user/:userId/my-cart' element={<Cart />} />
      </Route>
    )
  );


  return <RouterProvider router={router} />;
}

export default App;
