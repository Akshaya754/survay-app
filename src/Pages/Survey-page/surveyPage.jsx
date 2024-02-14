import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import TopNavbar from "../Navbar/TopNavbar";
import backgroundImg from "../../Assets/option-writing-checkbox-concepts-survey.jpg";
import { app } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

const ResponsesPage = () => {
  const [responses, setResponses] = useState([]);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const formatDate = (timestamp) => {

    if (!timestamp) {
      return "Invalid Date";
    }
  
    const date = new Date(timestamp);
    
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
  
    return date.toLocaleString();
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const database = getDatabase(app);
        const responsesRef = ref(database, "responses");

        onValue(responsesRef, (snapshot) => {
          const data = snapshot.val();

          let responsesArray = [];


        if (data) {
          const responsesArray = Object.values(data);

          const filteredResponses = selectedCategory
            ? responsesArray.filter(
                (response) =>
                  Object.keys(response.survey ?? {})
                    .map((category) => category.toLowerCase())
                    .includes(selectedCategory.toLowerCase())
              )
            : responsesArray;

          setResponses([...filteredResponses]);
        } else {
          console.warn("No responses fetched or invalid data format:", data);
        }
        console.log(responsesArray.map(response => response.submissionTime));

      });
      } catch (error) {
        console.error("Error fetching responses:", error);
      }
    };

    fetchData();
  }, [selectedCategory]);

  const handleCardClick = (response) => {
     setSelectedResponse(response);

    navigate(`/display?email=${response.userDetails.email}`);

  };

  const handleCategoryFilter = (category) => {

    setSelectedCategory(category);
  };

  if (responses.length === 0) {
    return (
      <div className="flex flex-col min-h-screen relative backdrop-blur-lg">
        <div className="fixed inset-0 overflow-hidden" style={{ zIndex: "-1" }}>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImg})` }}
          ></div>
        </div>
        <TopNavbar className="fixed top-0 left-0 w-full" />
        <div className="pt-16">
          <div
            className="flex items-center justify-center min-h-screen bg-cover bg-center"
            style={{
              backgroundImage: `url(${backgroundImg})`,
              backgroundSize: "cover",
            }}
          >
            <div className="bg-white p-8 rounded-lg shadow-md w-150 mt-50">
              <p className="text-gray-700 text-2xl font-bold mb-5 text-center h-32">
                Welcome to our survey! Please take a moment to provide your
                feedback.
              </p>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-700"
                onClick={() => navigate("/user")}

              >
                Take a Survey
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen relative  ">
      <div className="fixed inset-0 overflow-hidden" style={{ zIndex: "-1" }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImg})` }}
        ></div>
      </div>
      <TopNavbar className="fixed top-0 left-0 w-full" />
      <div className="pt-16">
        <h1 className="text-4xl font-semibold mt-10 text-center">
          Survey List
        </h1>
        <div className="max-w-5xl mt-10 mx-auto">

        <div className="mb-4 flex space-x-4">
            <button
              className={`px-4 py-2 ${
                !selectedCategory ? "bg-blue-500 text-white" : ""
              } rounded-md hover:bg-blue-600 text-2xl focus:outline-none focus:ring focus:border-blue-700`}
              onClick={() => handleCategoryFilter(null)}
            >
              All
            </button>
           
            <button
              className={`px-4 py-2 ${
                selectedCategory === "HealthCare" ? "bg-blue-500 text-white" : ""
              } rounded-md hover:bg-blue-600   text-2xl focus:outline-none focus:ring focus:border-blue-700`}
              onClick={() => handleCategoryFilter("HealthCare")}
            >
              HealthCare
            </button>
            <button
              className={`px-4 py-2 ${
                selectedCategory === "student" ? "bg-blue-500 text-white" : ""
              } rounded-md hover:bg-blue-600   text-2xl focus:outline-none focus:ring focus:border-blue-700`}
              onClick={() => handleCategoryFilter("student")}
            >
              Student
            </button>
            <button
              className={`px-4 py-2 ${
                selectedCategory === "yoga" ? "bg-blue-500 text-white" : ""
              } rounded-md hover:bg-blue-600  text-2xl focus:outline-none focus:ring focus:border-blue-700`}
              onClick={() => handleCategoryFilter("yoga")}
            >
              Yoga
            </button>
            <button
              className={`px-4 py-2 ${
                selectedCategory === "employee" ? "bg-blue-500 text-white" : ""
              } rounded-md hover:bg-blue-600  text-2xl focus:outline-none focus:ring focus:border-blue-700`}
              onClick={() => handleCategoryFilter("employee")}
            >
              Employee
            </button>
            <button
              className={`px-4 py-2 ${
                selectedCategory === "diabetes" ? "bg-blue-500 text-white" : ""
              } rounded-md hover:bg-blue-600  text-2xl focus:outline-none focus:ring focus:border-blue-700`}
              onClick={() => handleCategoryFilter("diabetes")}
            >
              Diabetes
            </button>
          </div>


          {responses.map((response, index) => (
              <div
              key={response.id} 
              className="mb-7 p-3 bg-white"
              style={{ borderRadius:"15px", cursor: "pointer" }}
              onClick={() => handleCardClick(response)}
            >
               <p className="font-semibold text-3xl mb-2">
                  Category: {Object.keys(response.survey ?? {})}
                </p>
                <p className="text-2xl">Name: {response.userDetails.name}</p>
                <p className="text-2xl">Email: {response.userDetails.email}</p>
                <p className="text-2xl">Phone: {response.userDetails.phone}</p>
                <p className="text-md text-gray-500">
                  Submission Time: {formatDate(response.submissionTime)}
                </p>
              </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResponsesPage;