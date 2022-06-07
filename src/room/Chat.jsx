import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { connect } from "react-redux";
import { setNotificationMessages, setOnlineUsers } from "../store/actions";
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

const Chat = (props) => {
  const { onlineUsers, setNotificationAction, notificationMessage } = props;
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

  useEffect(() => {
    let notifications = notificationMessage;
    if (notifications !== undefined) {
      //clear notification messages from state
      let newNotification = {};
      newNotification[id] = [];
      setNotificationAction(newNotification);

      // and from database
      fetch(
        `${process.env.REACT_APP_BETACARE_URL}/api/message/test/offline-messages/cleanup?loggedUserId=${currentUser.email}&userId=${id}`,
        {
          method: "PATCH",
        }
      )
        .then(async (response) => {
          console.log(await response.json());
        })
        .catch((err) => {
          console.log(err);
        });
    }

    fetch(
      `${process.env.REACT_APP_BETACARE_URL}/api/message/test/retrieve?loggedUserId=${currentUser.email}&userId=${id}&size=40`
    )
      .then(async (response) => {
        const data = await response.json();
        const usertype = currentUser.userType.toUpperCase();
        let messages = data.content;

        for (let i = 0; i < messages.length; i++) {
          const { message, sender } = messages[i];
          const isSender = sender === usertype;
          let div = messagesContainer.current;
          const p = document.createElement("p");
          p.textContent = message;
          if (isSender) addStyleToSentMessages(p);
          else addStyleToReceivedMessages(p);
          div.appendChild(p);
        }
      })
      .catch((error) => {
        console.error(error);
      });

    const data = {
      owner: id,
      guest: currentUser.email,
    };
    socket.emit(SocketEvents.JOINROOM, data);

    return () => {
      if (messagesContainer.current === null) {
        console.log("leaving");
        socket.emit(SocketEvents.LEAVEROOM, data);
      }
    };
  }, []);

  useEffect(() => {
    socket.on(SocketEvents.SEND_MESSAGE, (data) => {
      console.log("received", data);
      let div = messagesContainer.current;
      console.log("messagesContainer", div);
      const p = document.createElement("p");
      p.textContent = data.message;
      addStyleToReceivedMessages(p);
      div.appendChild(p);
    });

    return () => {
      socket.off(SocketEvents.SEND_MESSAGE, (data) => console.log(data));
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
    textContainer.current.value = "";
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
    p.textContent = message;
    addStyleToSentMessages(p);
    div.appendChild(p);

    socket.emit(SocketEvents.SEND_MESSAGE, data);
  };

  const addStyleToSentMessages = (p) => {
    const layout = p.style;
    layout.clear = "both";
    layout.float = "right";
    layout.padding = "5px 10px 5px 10px";
    layout.backgroundColor = "#fff";
    layout.marginBottom = "-2px";
    layout.borderRadius = "4px 10px 0px 10px";
  };

  const addStyleToReceivedMessages = (p) => {
    const layout = p.style;
    layout.clear = "both";
    layout.float = "left";
    layout.padding = "5px 10px 5px 10px";
    layout.backgroundColor = "#fff";
    layout.marginBottom = "-2px";
    layout.borderRadius = "0px 10px 4px 10px";
  };

  return (
    <div style={{ width: "75%", margin: "auto" }}>
      <p>
        {name}, {onlineStatus ? "Online" : "Offline"}
      </p>
      <div
        ref={messagesContainer}
        style={{
          border: "2px solid black",
          backgroundColor: "#d5e1df",
          display: "block",
          height: "390px",
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
    setNotificationAction: (notificationMessage) =>
      dispatch(setNotificationMessages(notificationMessage)),
  };
};

export default connect(mapStoreStateToProps, mapActionsToProps)(Chat);
