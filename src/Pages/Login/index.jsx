import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backgroundImg from "../../Assets/Images/option-writing-checkbox-concepts-survey.jpg";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import "@headlessui/react";
import "tailwindcss/tailwind.css";

function Login() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { email, password } = loginData;

    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      console.log("Login successful!", user);
      toast.success("User logged in successfully!");

      navigate("/survey");
    } catch (error) {
      console.error("Error signing in: ", error.message);
      toast.error("Invalid credentials. Please check your email and password.");
    }
  };

  return (
    <Transition show as={React.Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={() => {}}
        style={{ background: `url(${backgroundImg})`, backgroundSize: "cover" }}
      >
        <div className="min-h-screen px-4 text-center">
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30 " />
            
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
                  
            <div className="inline-block w-full max-w-xl p-8 my-12 overflow-hidden 
            text-left align-middle transition-all transform bg-blue
             shadow-2xl rounded-lg h-[500px]">
              <Dialog.Title
                as="h3"
                className="text-3xl font-medium leading-6 text-gray-900  mt-10 "
              >
                Login
              </Dialog.Title>
              <div className="mt-2">
                <form>
                  <label
                    htmlFor="email"
                    className="block text-2xl font-medium text-gray-700 mt-10"
                  >
                    Email
                  </label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                    className="mt-3 p-2 w-full border rounded-md"
                  />
                  <label
                    htmlFor="password"
                    className="block  text-2xl font-medium text-gray-700 mt-10"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    className="mt-3 p-2 w-full border rounded-md"
                  />
                </form>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  className="inline-flex justify-center mt-10 px-4 py-2 text-2xl font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={handleSubmit}
                >
                  Login
                </button>
              </div>
            </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default Login;
