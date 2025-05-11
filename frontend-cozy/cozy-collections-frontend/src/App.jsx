import { Route,RouterProvider,createBrowserRouter,createRoutesFromElements }from 'react-router-dom'

import Home from './pages/Home';
import RootLayout from './layouts/RootLayout';

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout/>}>
        <Route index element={<Home/>}/>
        
      </Route>
    )
  )
  

  return (
    <RouterProvider router={router} />
  )
}

export default App;
