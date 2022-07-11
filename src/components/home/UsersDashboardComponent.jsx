import React from "react";
import NotificationBadge from "./NotificationBadge";

export default function UsersDashboardComponent({
  user,
  userType,
  index,
  onlineUsers,
  userTyping,
  handleChatUser,
  notificationMessage,
}) {
  const id = user.id.toString();
  const email = user.email;
  const name = user.firstName;
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
        {displayWhenUserIsTyping(isTyping, name, userType)}
        {displayLastMessage(isNotified, lastMessage)}
      </td>
      <td>{email}</td>
      {displayNotificationBadge(isOnline, isNotified, count)}
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
}

const displayNotificationBadge = (
  isOnline = false,
  isNotified = false,
  count
) => {
  const onlineStatus = isOnline ? "Online" : "Offline";

  return (
    <td style={isOnline ? { color: "blue", fontWeight: "26px" } : {}}>
      {onlineStatus}
      <span>{isNotified && <NotificationBadge count={count} />}</span>
    </td>
  );
};

const displayWhenUserIsTyping = (isTyping = false, name, userType) => {
  return (
    <div>
      {`${name}, (${userType})`} <small>{isTyping && ", typing..."}</small>
    </div>
  );
};

const displayLastMessage = (isNotified, lastMessage) => {
  return <small>{isNotified && lastMessage}</small>;
};
