import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { setOnlineUsers } from "../store/actions";
import { socketConn } from "../utils/socketConfig";
import SocketEvents from "../enums/SocketEvents";
import { users } from "../utils/testUsers";
import { toast } from "react-toastify";

const chatBox = {
  position: "relative",
  left: 0,
  bottom: 0,
  border: "2px solid black",
  display: "inline",
  color: "white",
  textAlign: "center",
};

const rightMessage = {
  clear: "left",
  float: "right",
  padding: "5px 10px 5px 10px",
  backgroundColor: "#fff",
  borderRadius: "4px 10px 0px 10px",
};

const Chat = (props) => {
  const { onlineUsers, setOnlineUsersAction } = props;
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();
  const state = location.state;
  const socket = socketConn();
  const textContainer = useRef();
  const messagesContainer = useRef(null);
  const id = state.id;
  const name = state.name;
  // check if user is online
  const onlineStatus = onlineUsers.includes(id);
  // onlineUsers.includes(status);

  useEffect(() => {
    const data = {
      owner: id,
      guest: currentUser.email,
    };
    socket.emit(SocketEvents.JOINROOM, data);

    return () => {
      console.log(messagesContainer);
      if (messagesContainer.current === null) {
        console.log("leaving");
        socket.emit(SocketEvents.LEAVEROOM, data);
      }
    };
  }, []);

  const handleUserTyping = (id) => {
    if (currentUser == null) return;
    const data = {
      sender: currentUser.email,
      receiver: id,
      status: true,
    };

    socket.emit(SocketEvents.NOTIFY_TYPING, data);
  };

  const handleUserNotTyping = async () => {
    if (currentUser == null) return;
    const data = {
      sender: currentUser.email,
      receiver: id,
      status: false,
    };

    socket.emit(SocketEvents.NOTIFY_TYPING, data);
  };

  const handleSendMessage = (e) => {
    const id = e.target.id;
    const message = textContainer.current.value;
    let userType = users.find((user) => user.email === id).userType;
    if (currentUser.userType === userType) {
      toast("Doctor-Doctor or Patient-Patient Communication not allowed");
      return;
    }
    const data = {
      sender: { id: currentUser.email, userType: currentUser.userType },
      receiver: { id, userType: userType },
      message,
      senderAuthToken: "",
    };

    let div = messagesContainer.current;
    console.log("messagesContainer", div);
    const p = document.createElement("p");

    const textnode = document.createTextNode(message);
    p.appendChild(textnode);
    addStyleToSentMessages(p);

    div.appendChild(p);

    socket.emit(SocketEvents.SEND_MESSAGE, data);
  };

  const handleReceivedMessage = (message, sender) => {
    if (name === sender) {
    }
  };

  const userLeaveRoom = () => {};

  const addStyleToSentMessages = (p) => {
    const layout = p.style;
    layout.clear = "left";
    layout.float = "right";
    layout.padding = "5px 10px 5px 10px";
    layout.backgroundColor = "#fff";
    layout.borderRadius = "4px 10px 0px 10px";
  };

  const addStyleToReceivedMessages = (p) => {
    const layout = p.style;
    layout.clear = "right";
    layout.float = "left";
    layout.padding = "5px 10px 5px 10px";
    layout.backgroundColor = "#fff";
    layout.borderRadius = "0px 10px 4px 10px";
  };

  return (
    <div style={{ width: "80%", margin: "auto" }}>
      <p>
        {name}, {onlineStatus ? "Online" : "Offline"}
      </p>
      <div
        ref={messagesContainer}
        style={{
          border: "2px solid black",
          backgroundColor: "#d5e1df",
          display: "block",
          height: "450px",
          overflowY: "scroll",
          padding: "20px",
        }}
      ></div>
      <div>
        <div className="footer" style={chatBox}>
          <div
            style={{ display: "inline-block" }}
            onChange={() => handleUserTyping(id)}
            onBlur={() => handleUserNotTyping(id)}
          >
            <textarea ref={textContainer} rows="1" cols="73"></textarea>
          </div>
          <div style={{ display: "inline-block" }}>
            <button id={id} onClick={handleSendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStoreStateToProps = (state) => {
  return {
    ...state,
  };
};

const mapActionsToProps = (dispatch) => {
  return {
    setOnlineUsersAction: (users) => dispatch(setOnlineUsers(users)),
  };
};

export default connect(mapStoreStateToProps, mapActionsToProps)(Chat);
