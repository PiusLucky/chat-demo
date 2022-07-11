import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { saveLoggedUser } from "../utils/saveUser";
import { userLogin } from "../api/login.js";
import "./css/login.css";

const initialFormData = {
  email: "",
  password: "",
};

const Login = () => {
  const [formData, updateFormData] = useState(initialFormData);
  const [buttonState, setButtonState] = useState(true);
  const navigate = useNavigate();

  const handleOnchangeEvent = (e) => {
    updateFormData({ ...formData, [e.target.name]: e.target.value.trim() });
  };

  const authenticate = async (e) => {
    e.preventDefault();
    try {
      const result = await userLogin(formData);
      if (result.hasOwnProperty("message")) {
        toast(result.message);
        return;
      }

      const userType = getUserType(result.roles);
      saveLoggedUser({ ...result, userType });
      navigate("/message");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    localStorage.removeItem("user");
    if (!Object.values(formData).includes("")) {
      setButtonState(false);
    }
  }, [formData]);

  return (
    <>
      <form>
        <div className="imgcontainer">
          <img src="img_avatar2.png" alt="Avatar" className="avatar" />
        </div>

        <div className="container">
          <label htmlFor="email">
            <b>Email</b>
          </label>
          <input
            type="text"
            onChange={handleOnchangeEvent}
            placeholder="Enter your email"
            name="email"
            required
          />

          <label htmlFor="password">
            <b>Password</b>
          </label>
          <input
            type="password"
            placeholder="Enter Password"
            onChange={handleOnchangeEvent}
            name="password"
            required
          />

          <button
            type="submit"
            onClick={authenticate}
            value="Authenticate"
            disabled={buttonState}
          >
            Login
          </button>
        </div>
      </form>
    </>
  );
};

const getUserType = (roles) => {
  const role = roles[0];
  return role.replace("ROLE_", "");
};

export default Login;
