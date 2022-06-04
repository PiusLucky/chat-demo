import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { users } from "../utils/testUsers";
import { toast } from "react-toastify";
import { saveLoggedUser } from "../utils/saveUser";

const initialFormData = {
  email: "",
};

const Login = () => {
  const [formData, updateFormData] = useState(initialFormData);
  const [buttonState, setButtonState] = useState(true);
  const navigate = useNavigate();

  const handleOnchangeEvent = (e) => {
    let value = e.target.value;

    if (value === "Doctor" || value === "Patient") {
      updateFormData({ ...formData, userType: value });
    } else {
      updateFormData({ ...formData, [e.target.name]: e.target.value.trim() });
    }
  };

  const authenticate = () => {
    let email = formData.email;
    let user = users.find((user) => user.email === email);
    if (user === undefined) {
      toast("Invalid Email");
      return;
    }

    saveLoggedUser(user);
    // redirect
    navigate("/home");
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
        <h1>AUTHENTICATE USER</h1>
        <input
          type="text"
          onChange={handleOnchangeEvent}
          placeholder="Enter your email"
          name="email"
        />
        <br />
        <input
          onClick={authenticate}
          type="button"
          value="Authenticate"
          disabled={buttonState}
        />
      </form>
    </>
  );
};

export default Login;
