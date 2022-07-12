import React, { useEffect, useState } from "react";
import "../App.css";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setNotificationMessages,
  setOnlineUsers,
  setUsersTyping,
} from "../store/actions";
import { socketConn } from "../utils/socketConfig";
import SocketEvents from "../enums/SocketEvents";
import { getLoggedUser } from "../utils/saveUser";
import { otherUsers } from "../api/users";
import { getOfflineNotification } from "../api/message";
import { socketConnectionListener } from "../sockets/listeners/connectionListener";
import { userTypingEventListener } from "../sockets/listeners/userTypingEventListener";
import { notifyUserListener } from "../sockets/listeners/notifyUserListener";
import Chat from "./Chat";
import Home from "./Home";

const Message = ({
  onlineUsers,
  userTyping,
  setOnlineUsersAction,
  setUserTypingAction,
  notificationMessage,
  setNotificationAction,
}) => {
  let currentUser = getLoggedUser();
  const socket = socketConn();
  const [participants, setParticipants] = useState([]);
  const [page, setPage] = useState("home");
  const [reciever, setReciever] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getAllUsers(currentUser);
        setParticipants(result.content);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    socketConnectionListener(
      socket,
      SocketEvents,
      setOnlineUsersAction,
      currentUser
    );
  }, [onlineUsers]);

  useEffect(() => {
    userTypingEventListener(
      socket,
      SocketEvents,
      setUserTypingAction,
      userTyping
    );
  }, [userTyping]);

  useEffect(() => {
    notifyUserListener(
      socket,
      SocketEvents,
      notificationMessage,
      setNotificationAction
    );
  }, [notificationMessage]);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getOfflineNotification(currentUser);
        if (!result.hasOwnProperty("message")) {
          let senders = Object.keys(result);
          for (let i = 0; i < senders.length; i++) {
            let newNotification = {};
            newNotification[senders[i]] = [result[senders[i]]];
            setNotificationAction(newNotification);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  const handleChatUser = (e) => {
    let id = e.target.id;
    let name = e.target.name;
    e.preventDefault();
    setReciever({ id, name });
    setPage("chat");
  };

  return (
    <>
      <div onClick={() => navigate("/")}>
        <strong>LOGOUT</strong>
      </div>
      <div>
        <h3>
          Profile: {currentUser.email} ({currentUser.userType})
        </h3>
        {page === "home" ? (
          <Home
            participants={participants}
            currentUser={currentUser}
            onlineUsers={onlineUsers}
            userTyping={userTyping}
            handleChatUser={handleChatUser}
            notificationMessage={notificationMessage}
          />
        ) : (
          <Chat
            socket={socket}
            onlineUsers={onlineUsers}
            SocketEvents={SocketEvents}
            setNotificationAction={setNotificationAction}
            notificationMessage={notificationMessage}
            id={reciever.id}
            name={reciever.name}
            currentUser={currentUser}
            setPage={setPage}
          />
        )}
      </div>
    </>
  );
};

const getAllUsers = async ({ userType, token }) => {
  try {
    return await otherUsers(userType, token);
  } catch (error) {
    console.error(error);
  }
};

const mapStoreStateToProps = (state) => {
  return {
    ...state,
  };
};

const mapActionsToProps = (dispatch) => {
  return {
    setOnlineUsersAction: (users) => dispatch(setOnlineUsers(users)),
    setUserTypingAction: (userTyping) => dispatch(setUsersTyping(userTyping)),
    setNotificationAction: (notificationMessage) =>
      dispatch(setNotificationMessages(notificationMessage)),
  };
};

export default connect(mapStoreStateToProps, mapActionsToProps)(Message);
