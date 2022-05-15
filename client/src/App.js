import React, { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './bootstrapSuper.css';
import LoginInput from "./component/Authorization"
import MainPage from "./component/MainPage"

function App() {
  return (
    <Fragment>
      <Router>
        <Routes>
          <Route path="/" element={<LoginInput />} />
          <Route path="/mainpage" element={<MainPage />} />
        </Routes>
      </Router>
    </Fragment>
  );
}

export default App;
