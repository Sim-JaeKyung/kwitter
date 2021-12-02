import { signOut } from "@firebase/auth";
import { authService } from "fbase";
import React from "react";
import { Link } from "react-router-dom";

export default () => {
  const onLogOutClick = () => authService.signOut();
  return (
    <>
      Profile
      <br />
      <button onClick={onLogOutClick}>
        <Link to="/">Log Out</Link>
      </button>
    </>
  );
};
