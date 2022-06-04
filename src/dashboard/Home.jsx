import React, { useEffect, useState } from "react";
import "../App.css";
import { connect } from "react-redux";
import { setOnlineUsers, setUsersTyping } from "../store/actions";
import { socketConn } from "../utils/socketConfig";
import SocketEvents from "../enums/SocketEvents";
import { users } from "../utils/testUsers";
import { useNavigate } from "react-router-dom";
import { getLoggedUser } from "../utils/saveUser";

const dashboardUI = (user, index, onlineUsers, userTyping, handleChatUser) => {
  const id = user.email;
  const name = user.name;
  const isOnline = onlineUsers.includes(id);
  const isTyping = userTyping.includes(id);

  return (
    <tr key={index}>
      <td>
        {`${name}, (${user.userType})`} {isTyping && ", isTyping..."}
      </td>
      <td>{id}</td>
      {isOnline ? (
        <td style={{ color: "blue", fontWeight: "26px" }}>Online</td>
      ) : (
        <td>Offline</td>
      )}
      <td>
        <button
          id={id}
          name={name}
          style={{ backgroundColor: "#89CFF0" }}
          onClick={handleChatUser}
        >
          Chat
        </button>
      </td>
    </tr>
  );
};

const Home = ({
  onlineUsers,
  userTyping,
  setOnlineUsersAction,
  setUserTypingAction,
}) => {
  const navigate = useNavigate();
  let currentUser = getLoggedUser();
  let participants = users.filter((user) => user.email !== currentUser.email);
  const socket = socketConn();

  useEffect(() => {
    socket.on(SocketEvents.CONNECTION, () => {
      console.log("connected");
      socket.emit(SocketEvents.ONLINE, {
        id: currentUser.email,
        socketId: socket.id,
      });
    });
    socket.on(SocketEvents.USER_ONLINE, (data) => {
      setOnlineUsersAction(Object.keys(data));
    });
    return () => {
      socket.off(SocketEvents.USER_ONLINE, (data) => console.log(data));
    };
  }, [onlineUsers]);

  useEffect(() => {
    socket.on(SocketEvents.NOTIFY_TYPING, (data) => {
      const { status, sender } = data;
      console.log("just me", sender);
      if (status) {
        const arr = [];
        for (let i = 0; i < userTyping.length; i++) {
          arr.push(userTyping[i]);
        }

        if (!arr.includes(sender)) arr.push(sender);

        setUserTypingAction(arr);
      } else {
        const arr = [];
        for (let i = 0; i < userTyping.length; i++) {
          arr.push(userTyping[i]);
        }
        const users = arr.filter((user) => user !== sender);
        setUserTypingAction(users);
      }
    });
    return () => {
      socket.off(SocketEvents.NOTIFY_TYPING, (data) => console.log(data));
    };
  }, [userTyping]);

  const handleChatUser = (e) => {
    let id = e.target.id;
    let name = e.target.name;
    navigate("/chat", { state: { id, name } });
  };

  return (
    <>
      <div>
        <h1>All users</h1>
        <h3>
          Hi {currentUser.name} ({currentUser.userType})
        </h3>
        <hr />
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((user, index) =>
              dashboardUI(user, index, onlineUsers, userTyping, handleChatUser)
            )}
          </tbody>
        </table>
      </div>
    </>
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
    setUserTypingAction: (userTyping) => dispatch(setUsersTyping(userTyping)),
  };
};

export default connect(mapStoreStateToProps, mapActionsToProps)(Home);
