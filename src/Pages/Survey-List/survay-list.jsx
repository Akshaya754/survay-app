
// survey-list.jsx
import React, { useState, useEffect } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { getDatabase, ref, onValue, push, update } from "firebase/database";
import { app } from "../../firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backgroundImg from "../../Assets/option-writing-checkbox-concepts-survey.jpg";
import TopNavbar from "../Navbar/TopNavbar";
import { useNavigate, useSearchParams } from "react-router-dom";

const SurveyList = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [categories, setCategories] = useState([]);
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const database = getDatabase(app);
        const surveyRef = ref(database, "survey");

        onValue(surveyRef, (snapshot) => {
          const data = snapshot.val();

          if (data && Array.isArray(data)) {
            setCategories(data);
          } else {
            console.warn("No data fetched or invalid data format:", data);
          }
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const handleTabClick = (index) => {
    const isSurveyCompleted = Object.keys(formData).length > 0; // Check if any survey response is submitted
  
    if (isSurveyCompleted) {
      toast.error("You have already submitting a survey. Cannot switch to another survey.");
      return;
    }
  
    const selectedCategory = categories[index];
    const currentCategory = categories[activeIndex];
  
    if (
      formData[currentCategory.categoryName] &&
      currentCategory.categoryName !== selectedCategory.categoryName
    ) {
      toast.error(`You are currently attending a survey on ${currentCategory.categoryName}. Please complete it before switching.`);
      return;
    }
  
    setActiveIndex(index);
    setCurrentQuestionIndex(5);
  };
  const handleCheckboxChange = (categoryName, questionIndex, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [categoryName]: {
        ...prevData[categoryName],
        [questionIndex]: value,
      },
    }));
  };

  const handleNextQuestion = () => {
    const currentCategory = categories[activeIndex];
    const currentQuestion = currentCategory.questions[currentQuestionIndex];

    if (
      currentQuestion.isRequired &&
      !formData[currentCategory.categoryName]?.[currentQuestionIndex]
    ) {
      toast.error(
        "Please answer the required question before moving to the next one."
      );
      return;
    }

    if (currentQuestionIndex < currentCategory.questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      if (activeIndex < categories.length - 1) {
        setActiveIndex((prevIndex) => prevIndex + 1);
        setCurrentQuestionIndex(0);
      } else {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);

        handleSave();
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    } else {
      if (activeIndex > 0) {
        setActiveIndex((prevIndex) => prevIndex - 1);
        setCurrentQuestionIndex(
          categories[activeIndex - 1].questions.length - 1
        );
      }
    }
  };

  const handleSave = async () => {
    try {
      const database = getDatabase(app);
      const responsesRef = ref(database, "responses");
      const id = searchParams.get("id");

      // await push(responsesRef, formData);
      await update(ref(database, `responses/${id}`), {
        survey: formData,
      });
      setFormData({});
      toast.success("Response saved successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      navigate("/survey");
    } catch (error) {
      console.error("Error saving response:", error);
      toast.error("Error saving response. Please try again.");
    }
  };

  return (
    <div>
      <TopNavbar />
      <div
        className="p-8 g-cover bg-center mt-30 min-h-screen  "
        style={{ background: `url(${backgroundImg})`, backgroundSize: "cover" }}
      >
        <h1 className="text-4xl font-semibold mt-40 mb-10 text-center">
          Survey
        </h1>
        <Tabs.Root className="flex flex-col  mt-10 p max-w-5xl mx-auto">
          <Tabs.List className="flex space-x-12 bg-gray-200 p-2  text-3xl rounded">
            {categories.map((category, index) => (
              <Tabs.Trigger
                key={index}
                className={`p-2 cursor-pointer ${
                  activeIndex === index ? "bg-blue-500 text-white" : "bg-white"
                } transition duration-300 ease-in-out hover:bg-blue-300`}
                value={category.categoryName}
                onClick={() => handleTabClick(index)}
              >
                {category.categoryName}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          {categories.map((category, index) => (
            <Tabs.Content
              key={index}
              value={category.categoryName}
              className={`p-4 ${
                activeIndex === index ? "block" : "hidden"
              } border border-gray-300 mt-10 rounded transition duration-300 ease-in-out`}
            >
              <h2 className="text-3xl font-semibold mb-6">
                Current Category: {category.categoryName}
              </h2>
              {category.questions.map((question, questionIndex) => (
                <div
                  key={questionIndex}
                  className={`mb-6 ${
                    currentQuestionIndex === questionIndex ? "block" : "hidden"
                  }`}
                >
                  <p className="mb-2  text-2xl font-semibold">
                    {`Question ${questionIndex + 1}/${
                      category.questions.length
                    }: ${question.question}`}

                    {question.isRequired && (
                      <span className="text-red-500 font-bold ml-1">*</span>
                    )}
                  </p>
                  {question.isMultiChoice ? (
                    <div className="space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox"
                          onChange={(e) =>
                            handleCheckboxChange(
                              category.categoryName,
                              questionIndex,
                              e.target.checked ? "Yes" : "No"
                            )
                          }
                        />
                        <span className="ml-2">Yes</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox"
                          onChange={(e) =>
                            handleCheckboxChange(
                              category.categoryName,
                              questionIndex,
                              e.target.checked ? "No" : "Yes"
                            )
                          }
                        />
                        <span className="ml-2">No</span>
                      </label>
                    </div>
                  ) : (
                    <textarea
                      rows="4"
                      className="w-full  text-2xl border p-2 rounded focus:outline-none focus:border-blue-500"
                      placeholder="Enter your answer here..."
                      onChange={(e) =>
                        handleCheckboxChange(
                          category.categoryName,
                          questionIndex,
                          e.target.value
                        )
                      }
                    />
                  )}
                </div>
              ))}
            </Tabs.Content>
          ))}
        </Tabs.Root>

        <div className="mt-8   text-right">
          {currentQuestionIndex > 5 && (
            <button
              className="bg-gray-500 text-white  w-40 px-4 py-2  text-2xl rounded hover:bg-gray-600 mr-4"
              onClick={handlePreviousQuestion}
            >
              Previous
            </button>
          )}

          {currentQuestionIndex <
            (categories[activeIndex]?.questions?.length ?? 0) - 1 && (
            <button
              style={{ marginRight: "410px" }}
              className="bg-blue-500 text-white  w-40 px-4 py-2  text-2xl rounded hover:bg-blue-600"
              onClick={handleNextQuestion}
            >
              Next
            </button>
          )}
          {currentQuestionIndex ===
            (categories[activeIndex]?.questions?.length ?? 0) - 1 && (
            <button
              className="bg-blue-500 text-white  text-2xl px-4 py-2 rounded hover:bg-blue-600"
              onClick={handleSave}
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SurveyList;
