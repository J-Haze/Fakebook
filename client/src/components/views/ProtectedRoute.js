import React from "react";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ component: Component, isLoggedIn, ...props }) => {
  return (
    <Route
      exact
      {...props}
      render={(props) => {
        if (isLoggedIn) {
          return <Component {...props} user={user} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: "/"
              }}
            />
          );
        }
      }}
    />
  );
};

export default ProtectedRoute;