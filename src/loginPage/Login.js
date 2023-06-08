import React, { useEffect, useState } from "react";
import { auth, provider } from "./firebase";
import { signInWithPopup } from "firebase/auth";
import background from "../assets/images/login_bg.jpg";
import Homepage from "../UI/Pages/Homepage";
function Login() {
  const [value, setValue] = useState("");
  const [email, setEmail] = useState("");


  useEffect(() => {
    document.title = "Login | PME - CEERI";
  }, []);
  const handleClick = () => {
    signInWithPopup(auth, provider).then((data) => {
      setValue(data.user.displayName);
      setValue(data.user.email);
      localStorage.setItem("displayName", data.user.displayName);
      localStorage.setItem("email", data.user.email);
      setValue(data.user.photoURL);
      localStorage.setItem("photoURL", data.user.photoURL);
    });
  };

  useEffect(() => {
    // setValue(localStorage.getItem("displayName"));
    // setValue(localStorage.getItem("photoURL"));
    setValue(localStorage.getItem("email"));
    setEmail(localStorage.getItem("email"));
  }, []);

  return (
    <div>
      {value ? (
        <Homepage/>
      ) : (
        <div
          className="h-screen bg-cover bg-center flex items-start"
          style={{ backgroundImage: `url(${background})` }}
        >
          <div className="absolute top-24 left-1/2 transform -translate-x-1/2 bg-black/30 text-white/90 p-8 rounded shadow-lg">
            <h1 className="font-bold text-3xl my-4">Welcome to PME - CEERI</h1>
            <button
              type="button"
              class="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mr-2 mb-2 lg:scale-150"
              onClick={handleClick}
            >
              <svg
                class="mr-2 -ml-1 w-4 h-4"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="google"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
              >
                <path
                  fill="currentColor"
                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                ></path>
              </svg>
              Login with Google
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
