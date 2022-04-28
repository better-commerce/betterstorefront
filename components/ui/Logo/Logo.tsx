import React from "react";

const Logo = ({ className = '', ...props }) => {
  return (
    <img
      className="h-8 w-auto"
      src="https://tailwindui.com/img/logos/workflow-mark.svg?color=indigo&shade=600"
      alt=""
    />
  );
}

export default Logo
