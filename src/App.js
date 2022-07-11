import React from "react";
import Login from "./auth/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Message from "./page/Message";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Router>
        <Routes>
          <Route exact path="/message" element={<Message />} />
          <Route exact path="/" element={<Login />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
