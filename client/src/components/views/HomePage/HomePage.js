import React, { useState, useEffect } from "react";
import "./HomePage.css";

function HomePage(props) {

  return (
    <>
      <div id="home">
        Home Page
         {props.currentUser}
      </div>
    </>
  );
}

export default HomePage;
