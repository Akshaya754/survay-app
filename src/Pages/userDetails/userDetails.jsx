import React, { useState} from "react";
import { getDatabase, ref, push, update} from "firebase/database";
import { app } from "../../firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backgroundImg from "../../Assets/Images/option-writing-checkbox-concepts-survey.jpg";
import TopNavbar from "../Navbar/TopNavbar";
import { useNavigate } from "react-router-dom";

const UserList = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const [phoneValidation, setPhoneValidation] = useState(true);
  const [emailValidation, setEmailValidation] = useState(true);
  const [nameValidation, setNameValidation] = useState(true);

  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
  });

  const navigate = useNavigate();
  const database = getDatabase(app);


  const validateName = (name) => {
    const nameRegex = /^[a-zA-Z\s]*$/;
    return nameRegex.test(name);
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleUserDetailsChange = (field, value) => {
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));

    if (field === "phone") {
      setPhoneValidation(validatePhoneNumber(value));
    }

    if (field === "email") {
      setEmailValidation(validateEmail(value));
    }

    if (field === "name") {
      setNameValidation(validateName(value));
    }
  };

  const handleUserDetailsSubmit = async () => {
    const isUserDetailsValid =
      // userDetails.name &&
      nameValidation &&
      userDetails.email &&
      emailValidation &&
      phoneValidation &&
      userDetails.address &&
      userDetails.gender;

    if (isUserDetailsValid) {
      try {
        const database = getDatabase(app);
        const responsesRef = ref(database, "responses");
        const responseId = push(responsesRef).key;

        const combinedData = {
          userDetails,
          ...formData,
          submissionTime: new Date().getTime(),
        };

        await update(ref(database, `responses/${responseId}`), combinedData);

        setActiveIndex(1);
        handleSurveyListNavigation(responseId);
      } catch (error) {
        console.error("Error saving response:", error);
        toast.error("Error saving response. Please try again.");
      }
    } else {
      toast.error("Please fill in all user details before proceeding.");
    }
  };

  const handleSurveyListNavigation = (responseId) => {
    navigate(`/survey-list?id=${responseId}`);
  };
const  handleUserDetailsCancel =()=>{
  navigate('/survey')
}
  return (
    <div>
      <TopNavbar />
      <div
        className="p-8 g-cover bg-center mt-30 min-h-screen "
        style={{ background: `url(${backgroundImg})`, backgroundSize: "cover" }}
      >
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-white p-8 mt-20 rounded shadow-md">
            <h1 className="text-4xl font-semibold mb-6 text-center">
              User Details
            </h1>
            <div className="mb-4">
              <label className="block text-2xl mb-2">Name:</label>
              <input
                type="text"
                className={`w-full border p-2 rounded ${
                  nameValidation ? "" : "border-red-500"
                }`}
                value={userDetails.name}
                onChange={(e) =>
                  handleUserDetailsChange("name", e.target.value)
                }
                placeholder="Enter your name"

              />
              {!nameValidation && (
                <p className="text-red-500">Invalid name format</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-2xl mb-2">Email:</label>
              <input
                type="email"
                className={`w-full border p-2 rounded ${
                  emailValidation ? "" : "border-red-500"
                }`}
                value={userDetails.email}
                onChange={(e) =>
                  handleUserDetailsChange("email", e.target.value)
                }
                placeholder="Enter your email"

              />
              {!emailValidation && (
                <p className="text-red-500">Invalid email format</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-2xl mb-2">Phone:</label>
              <input
                type="text"
                className={`w-full border p-2 rounded ${
                  phoneValidation ? "" : "border-red-500"
                }`}
                value={userDetails.phone}
                onChange={(e) =>
                  handleUserDetailsChange("phone", e.target.value)
                }
                placeholder="Enter your phone number"

              />
              {!phoneValidation && (
                <p className="text-red-500">Invalid phone number format</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-2xl mb-2">Address:</label>
              <textarea
                rows="4"
                className="w-full border p-2 rounded"
                value={userDetails.address}
                onChange={(e) =>
                  handleUserDetailsChange("address", e.target.value)
                }
                placeholder="Enter your address"

              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-2xl mb-2">Gender:</label>
              <select
                className="w-full border text-1xl p-2 rounded"
                value={userDetails.gender}
                onChange={(e) =>
                  handleUserDetailsChange("gender", e.target.value)
                }
                placeholder="Select your gender"

              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="female">Others</option>
              </select>
            </div>
            <div className="flex justify-end">

            <button
              className="bg-gray-500 text-white px-4 py-2 text-2xl  rounded hover:bg-blue-600 mr-2"
              onClick={() => {
                handleUserDetailsCancel();
              }}
            >
              Cancel
            </button>
            <button
              className="bg-blue-500 text-white  gap-5 px-4 py-2 text-2xl  rounded hover:bg-blue-600"
              onClick={() => {
                handleUserDetailsSubmit();
              }}
            >
              Submit
            </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;
