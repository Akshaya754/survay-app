import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import TopNavbar from "../Navbar/TopNavbar";
import backgroundImg from "../../Assets/option-writing-checkbox-concepts-survey.jpg";
import { app } from "../../firebase";
import { useNavigate,  useSearchParams } from "react-router-dom";
 
function DisplayPage() {
  const [responses, setResponses] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  //   const id = searchParams.get("user");
  const email = searchParams.get("email");
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const database = getDatabase(app);
        const responsesRef = ref(database, "responses");
 
        onValue(responsesRef, (snapshot) => {
          const data = snapshot.val();
 
          if (data) {
            const responsesArray = Object.values(data);
            const selectedResponse = responsesArray.find(
              (response) => response.userDetails.email === email
            );
            setResponses(selectedResponse ? [selectedResponse] : []);
          } else {
            console.warn("No responses fetched or invalid data format:", data);
          }
        });
      } catch (error) {
        console.error("Error fetching responses:", error);
      }
    };
 
    fetchData();
  }, [email]);
 
  return (
    <div className="flex flex-col min-h-screen relative backdrop-blur-lg ">
      <div className="fixed inset-0 overflow-hidden" style={{ zIndex: "-1" }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImg})` }}
        ></div>
      </div>
      <TopNavbar className="fixed top-0 left-0 w-full" />
      <div className="pt-16">
        <h1 className="text-4xl font-semibold mt-10 text-center">
          Survey Report
        </h1>
        <div className="max-w-5xl mt-10 mx-auto">
          {responses.map((response, index) => (
            <div
              key={response.id}
              className="mb-7 p-3 bg-white blur-1"
              style={{ borderRadius:"10px", cursor: "pointer" }}
            >
              <p className="font-semibold text-3xl mb-2">
                Name: {response.userDetails.name}
              </p>
              <p className="text-2xl">Email: {response.userDetails.email}</p>
              <p className="text-2xl">Phone: {response.userDetails.phone}</p>
              <p className="text-2xl">
                Address: {response.userDetails.address}
              </p>
              <p className="text-2xl">Gender: {response.userDetails.gender}</p>
              <hr className="mt-5 "></hr>
              <p className="font-semibold text-3xl mt-5 mb-2">Survey Responses</p>
              {Object.entries(response.survey).map(([category, answers]) => (
                <div key={category} className="mb-4">
                  <p className="font-semibold text-2xl mb-2">{category}</p>
                  {Object.entries(answers).map(([question, answer]) => (
                    <div key={question} className="flex items-center mb-2">
                      <p className="mr-2 text-2xl font-large">{question}:</p>
                      <p className="mr-3 text-2xl font-large">
                        {Array.isArray(answer) ? answer[index] : answer}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default DisplayPage;
 