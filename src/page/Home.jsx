import React from "react";
import UsersDashboardComponent from "../components/home/UsersDashboardComponent.jsx";

export default function Home({
  participants,
  currentUser,
  onlineUsers,
  userTyping,
  handleChatUser,
  notificationMessage,
}) {
  return (
    <>
      <h2>All users</h2>
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
          {participants.map((user, index) => (
            <UsersDashboardComponent
              key={index}
              user={user}
              userType={
                currentUser.userType === "PATIENT" ? "DOCTOR" : "PATIENT"
              }
              index={index}
              onlineUsers={onlineUsers}
              userTyping={userTyping}
              handleChatUser={handleChatUser}
              notificationMessage={notificationMessage}
            />
          ))}
        </tbody>
      </table>
    </>
  );
}
