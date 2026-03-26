import { Routes, Route, Navigate } from "react-router-dom"
import AuthGuard from "./auth/AuthGuard"

import Login          from "./pages/Login"
import Register       from "./pages/Register"
import NotFound       from "./pages/NotFound"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword  from "./pages/ResetPassword"
import Home           from "./pages/Home"
import Categories     from "./pages/user/Categories"
import ContactUs      from "./pages/ContactUs"

import Profile        from "./pages/Profile"
import ChangePassword from "./pages/ChangePassword"

import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminUsers     from "./pages/admin/AdminUsers"
import AdminVendors   from "./pages/admin/AdminVendors"
import AdminProducts  from "./pages/admin/AdminProducts"
import AdminOrders    from "./pages/admin/AdminOrders"
import AdminKYC       from "./pages/admin/AdminKyc"

import VendorDashboard from "./pages/vendor/VendorDashboard"
import VendorProducts  from "./pages/vendor/VendorProducts"
import VendorOrders    from "./pages/vendor/VendorOrders"

import Shop     from "./pages/user/Shop"
import Cart     from "./pages/user/Cart"
import MyOrders from "./pages/user/MyOrders"

const App = () => {
  return (
    <Routes>
      <Route path="/"                element={<Navigate to="/home" replace />} />
      <Route path="/home"            element={<Home />}           />
      <Route path="/login"           element={<Login />}          />
      <Route path="/register"        element={<Register />}       />
      <Route path="/forgotPassword"  element={<ForgotPassword />} />
      <Route path="/change-password" element={<ResetPassword />}  />
      <Route path="/categories"      element={<Categories />}     />
      <Route path="/contact"         element={<ContactUs />}      />

      <Route element={<AuthGuard />}>
        <Route path="/admin/dashboard"      element={<AdminDashboard />}  />
        <Route path="/admin/users"          element={<AdminUsers />}      />
        <Route path="/admin/vendors"        element={<AdminVendors />}    />
        <Route path="/admin/products"       element={<AdminProducts />}   />
        <Route path="/admin/orders"         element={<AdminOrders />}     />
        <Route path="/admin/kyc"            element={<AdminKYC />}        />
        <Route path="/vendor/dashboard"     element={<VendorDashboard />} />
        <Route path="/vendor/products"      element={<VendorProducts />}  />
        <Route path="/vendor/orders"        element={<VendorOrders />}    />
        <Route path="/shop"                 element={<Shop />}            />
        <Route path="/cart"                 element={<Cart />}            />
        <Route path="/orders"               element={<MyOrders />}        />
        <Route path="/me"                   element={<Profile />}         />
        <Route path="/change-password-auth" element={<ChangePassword />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App