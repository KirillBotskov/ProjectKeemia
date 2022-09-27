import React, { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './bootstrapSuper.css';
import Login from "./component/Login"
import Home from "./component/Home"
import Private from "./component/PrivateComponent"

function App() {
  return (
    <Fragment>
      <Router>
        <Routes>
          <Route element={<Private />}>
            <Route path="/home" element={<Home />} />
          </Route>
            <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    </Fragment>
  );
}

export default App;
