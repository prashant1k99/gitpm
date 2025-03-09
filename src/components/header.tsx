import type { Component } from 'solid-js';
import { signOut } from "firebase/auth";
import { auth } from "@/utils/firebase"
import { useNavigate } from '@solidjs/router';

const Header: Component = () => {
  const navigate = useNavigate()
  const signOutUser = () => {
    signOut(auth).then(() => {
      navigate("/login")
      // Sign-out successful.
    }).catch((error) => {
      console.error(error)
      // An error happened.
    });
  }

  return (
    <button onClick={signOutUser} class="btn btn-error">Sign Out</button>
  );
};

export default Header;
