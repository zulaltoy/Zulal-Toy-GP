import React from "react";
import { useSelector } from "react-redux";
import { useLocation, Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({children,allowedRoles =[],useOutlet=false}) => {
    const location = useLocation();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    //const userRoles = useSelector((state) => state.auth.user?.roles );
    const roles = useSelector((state) => state.auth.roles || []);

    if (!Array.isArray(roles)) return null; // veya []

    if (!isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }
  //const userRolesLowerCase = userRoles?.map(role => role.toLowerCase());
  const userRolesLowerCase = roles?.map(role => role.toLowerCase());

  const allowedRolesLowerCase = allowedRoles.map(role => role.toLowerCase());

  const isAuthorized = userRolesLowerCase.some((userRole) =>
    allowedRolesLowerCase.includes(userRole)
  );
  if(isAuthorized) {
    return useOutlet ? <Outlet /> : children;
  }else {
    return <Navigate to='/unauthorized' state={{ from: location }} replace />;
  }

 
}

export default ProtectedRoute