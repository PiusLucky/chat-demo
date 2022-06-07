import React, { useEffect } from "react";
import "../App.css";
import { connect } from "react-redux";
import {
  setNotificationMessages,
  setOnlineUsers,
  setUsersTyping,
} from "../store/actions";
import { socketConn } from "../utils/socketConfig";
import SocketEvents from "../enums/SocketEvents";
import { users } from "../utils/testUsers";
import { useNavigate } from "react-router-dom";
import { getLoggedUser } from "../utils/saveUser";

const notificationBadge = (count) => {
  if (count !== 0) {
    return (
      <span
        style={{
          position: "relative",
          padding: "5px 10px",
          borderRadius: "50%",
          background: "green",
          color: "white",
        }}
      >
        {count}
      </span>
    );
  } else {
    return <div></div>;
  }
};

const dashboardUI = (
  user,
  index,
  onlineUsers,
  userTyping,
  handleChatUser,
  notificationMessage
) => {
  const id = user.email;
  const name = user.name;
  const isOnline = onlineUsers.includes(id);
  const isTyping = userTyping.includes(id);
  const notifications = notificationMessage[id];
  const isNotified = notifications !== undefined;
  let count = 0;
  let lastMessage = "";
  if (isNotified) {
    count = notifications.length;
    lastMessage = notifications[notifications.length - 1];
  }

  return (
    <tr key={index}>
      <td>
        <div>
          {`${name}, (${user.userType})`}{" "}
          <small>{isTyping && ", typing..."}</small>
        </div>
        <small>{isNotified && lastMessage}</small>
      </td>
      <td>{id}</td>
      {isOnline ? (
        <td style={{ color: "blue", fontWeight: "26px" }}>
          Online <span>{isNotified && notificationBadge(count)}</span>
        </td>
      ) : (
        <td>
          Offline <span>{isNotified && notificationBadge(count)}</span>
        </td>
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
  notificationMessage,
  setNotificationAction,
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

  useEffect(() => {
    socket.on(SocketEvents.NOTIFY_USER, (data) => {
      if (notificationMessage[data.sender] === undefined) {
        let newNotification = {};
        newNotification[data.sender] = [data.message];
        setNotificationAction(newNotification);
      } else {
        let oldNotification = notificationMessage[data.sender];
        let updatedNotification = oldNotification.concat([data.message]);
        notificationMessage[data.sender] = updatedNotification;
        setNotificationAction(notificationMessage);
      }
    });
  }, [notificationMessage]);

  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_BETACARE_URL}/api/message/test/offline-messages/count?loggedUserId=${currentUser.email}`
    )
      .then(async (response) => {
        const data = await response.json();
        let senders = Object.keys(data);

        for (let i = 0; i < senders.length; i++) {
          let newNotification = {};
          newNotification[senders[i]] = [data[senders[i]]];
          setNotificationAction(newNotification);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

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
              dashboardUI(
                user,
                index,
                onlineUsers,
                userTyping,
                handleChatUser,
                notificationMessage
              )
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
    setNotificationAction: (notificationMessage) =>
      dispatch(setNotificationMessages(notificationMessage)),
  };
};

export default connect(mapStoreStateToProps, mapActionsToProps)(Home);
