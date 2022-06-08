import React from "react";

const Spinner = () => {
  return (
    <div
      style={{
        position: "absolute",
        margin: "auto",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 999,
      }}
      className="spinner-border text-primary"
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;
