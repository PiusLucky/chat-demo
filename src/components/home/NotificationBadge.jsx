import React from "react";

export default function NotificationBadge({ count }) {
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
}
