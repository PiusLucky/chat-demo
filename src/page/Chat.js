import React, { useEffect, useRef } from "react";
import { cleanUpNotifications, getMessages } from "../api/message";
import { joinRoomEmitter } from "../sockets/emitters/joinRoomEmitter";
import { incomingMessageListener } from "../sockets/listeners/incomingMessageListener";
import { sendMessageEmitter } from "../sockets/emitters/sendMessageEmitter";
import { userTypingEmitter } from "../sockets/emitters/userTypingEmitter";
import { userNotTypingEmitter } from "../sockets/emitters/userNotTypingEmitter";
import { leaveRoomEmitter } from "../sockets/emitters/leaveRoomEmitter";

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
  setPage,
}) {
  const textContainer = useRef();
  const messagesContainer = useRef(null);
  const onlineStatus = onlineUsers.includes(id);

  const handleSendMessage = (e) => {
    // display message and send it to the receiver
    sendMessageEmitter(
      e,
      textContainer,
      socket,
      SocketEvents,
      messagesContainer,
      currentUser,
      addStyleToSentMessages
    );
  };

  useEffect(() => {
    // clean up notifications
    cleanUpChatNotifications(
      id,
      currentUser,
      notificationMessage,
      setNotificationAction
    );

    //get messages from DB and display on chat box
    getMessagesData(id, currentUser, messagesContainer);

    // join room
    joinRoomEmitter(id, socket, SocketEvents, currentUser);
  }, []);

  useEffect(() => {
    // listen to incoming message and display
    incomingMessageListener(
      socket,
      SocketEvents,
      addStyleToReceivedMessages,
      messagesContainer
    );
  }, []);
  return (
    <div style={{ width: "75%", margin: "auto" }}>
      <button
        onClick={() => {
          setPage("home");
          leaveRoomEmitter(id, socket, SocketEvents, currentUser);
        }}
      >
        Go Back
      </button>

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
              userTypingEmitter(currentUser, id, socket, SocketEvents)
            }
            onBlur={() =>
              userNotTypingEmitter(currentUser, id, socket, SocketEvents)
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

const cleanUpChatNotifications = (
  id,
  currentUser,
  notificationMessage,
  setNotificationAction
) => {
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
        console.error(result);
      }
    }
    cleanNotificationData();
  }
};

async function getMessagesData(id, currentUser, messagesContainer) {
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
