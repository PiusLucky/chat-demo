import React, { useEffect, useRef } from "react";
import { cleanUpNotifications, getMessages } from "../api/message";

const chatBox = {
  position: "relative",
  left: 0,
  bottom: 0,
  border: "2px solid black",
  display: "inline",
  color: "white",
  textAlign: "center",
};

export default function Chat({
  socket,
  onlineUsers,
  SocketEvents,
  setNotificationAction,
  notificationMessage,
  id,
  name,
  currentUser,
}) {
  const textContainer = useRef();
  const messagesContainer = useRef(null);
  const onlineStatus = onlineUsers.includes(id);

  const handleSendMessage = (e) => {
    const id = e.target.id.toString();
    const message = textContainer.current.value;
    textContainer.current.value = "";
    let userType = currentUser.userType;
    const data = {
      sender: { id: currentUser.id.toString(), userType },
      receiver: { id, userType: userType === "PATIENT" ? "DOCTOR" : "PATIENT" },
      message,
      token: currentUser.token,
    };
    let div = messagesContainer.current;
    const p = document.createElement("p");
    p.textContent = message;
    addStyleToSentMessages(p);
    div.appendChild(p);
    console.log(data, "dataaaaaaaaaaa");
    socket.emit(SocketEvents.SEND_MESSAGE, data);
  };

  useEffect(() => {
    let notifications = notificationMessage;
    if (notifications !== undefined) {
      //clean notification messages from redux state
      let newNotification = {};
      newNotification[id] = [];
      setNotificationAction(newNotification);

      // clean notification messages from database
      async function cleanNotificationData() {
        const result = await cleanUpNotifications(id, currentUser.token);
        if (!result.hasOwnProperty("message")) {
          console.log(result);
        }
      }
      cleanNotificationData();
    }
    //get messages from DB
    async function getMessagesData() {
      const { token } = currentUser;
      const data = await getMessages(id, token);
      if (!data.hasOwnProperty("message")) {
        const usertype = currentUser.userType;
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
      }
    }
    getMessagesData();

    const data = {
      owner: id,
      guest: currentUser.id.toString(),
    };
    socket.emit(SocketEvents.JOINROOM, data);
    return () => {
      if (messagesContainer.current === null) {
        socket.emit(SocketEvents.LEAVEROOM, data);
      }
    };
  }, []);

  useEffect(() => {
    socket.on(SocketEvents.SEND_MESSAGE, (data) => {
      let div = messagesContainer.current;
      const p = document.createElement("p");
      p.textContent = data.message;
      addStyleToReceivedMessages(p);
      div.appendChild(p);
    });
    return () => {
      socket.off(SocketEvents.SEND_MESSAGE, (data) => console.log(data));
    };
  }, []);
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
            onChange={() =>
              handleUserTyping(currentUser, id, socket, SocketEvents)
            }
            onBlur={() =>
              handleUserNotTyping(currentUser, id, socket, SocketEvents)
            }
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
}

const addStyleToSentMessages = (p) => {
  const layout = p.style;
  layout.clear = "both";
  layout.float = "right";
  layout.padding = "5px 10px 5px 10px";
  layout.backgroundColor = "#fff";
  layout.marginBottom = "-1px";
  layout.borderRadius = "4px 10px 0px 10px";
};

const addStyleToReceivedMessages = (p) => {
  const layout = p.style;
  layout.clear = "both";
  layout.float = "left";
  layout.padding = "5px 10px 5px 10px";
  layout.backgroundColor = "#fff";
  layout.marginBottom = "-1px";
  layout.borderRadius = "0px 10px 4px 10px";
};

const handleUserTyping = (currentUser, id, socket, SocketEvents) => {
  if (currentUser == null) return;
  const data = {
    sender: currentUser.email,
    receiver: id,
    status: true,
  };
  socket.emit(SocketEvents.NOTIFY_TYPING, data);
};

const handleUserNotTyping = async (currentUser, id, socket, SocketEvents) => {
  if (currentUser == null) return;
  const data = {
    sender: currentUser.email,
    receiver: id,
    status: false,
  };
  socket.emit(SocketEvents.NOTIFY_TYPING, data);
};
