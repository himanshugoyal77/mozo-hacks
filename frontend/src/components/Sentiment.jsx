import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Bars } from "react-loader-spinner";
import BACKEND_URL from "../commons";

const Sentiment = () => {
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  console.log("id in sentiment", id);

  useEffect(() => {
    const fetchData = async () => {
      const url = `${BACKEND_URL}/sentiment/${id}`;
      try {
        const response = await axios.get(url);
        const { data } = response;

        setComments(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sentiment analysis results:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getButtonColor = (label) => {
    switch (label) {
      case "positive":
        return "bg-green-300";
      case "negative":
        return "bg-red-300";
      case "neutral":
        return "bg-blue-300";
      default:
        return "bg-gray-300";
    }
  };

  const filterComments = (label) => {
    if (label === filter) {
      setFilter("all");
    } else {
      setFilter(label);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => filterComments("all")}
          className={`btn ${getButtonColor("all")}`}
        >
          All
        </button>
        <button
          onClick={() => filterComments("positive")}
          className={`btn ${getButtonColor("positive")}`}
        >
          Positive
        </button>
        <button
          onClick={() => filterComments("negative")}
          className={`btn ${getButtonColor("negative")}`}
        >
          Negative
        </button>
        <button
          onClick={() => filterComments("neutral")}
          className={`btn ${getButtonColor("neutral")}`}
        >
          Neutral
        </button>
      </div>
      <ul className="list-disc ml-4">
        {!loading ? (
          comments.map(
            (comment, index) =>
              (filter === "all" || filter === comment.label) && (
                <li key={index} className="text-left mb-2">
                  {comment.text}
                </li>
              )
          )
        ) : (
          <Bars
            height="30"
            width="30"
            color="#FF00FF"
            className="mx-auto"
            ariaLabel="bars-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        )}
      </ul>
    </div>
  );
};

export default Sentiment;
