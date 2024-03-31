import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Logo from "./components/Logo";
import { Bars } from "react-loader-spinner";

function App() {
  const [videoId, setVideoId] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [comments, setComments] = useState([]);
  const [neutral, setNeutral] = useState(0);
  const [happy, setHappy] = useState(0);
  const [sad, setSad] = useState(0);

  useEffect(() => {
    const getVideoId = async () => {
      let [tab] = await chrome.tabs.query({ active: true });
      const id = tab.url.split("v=")[1].split("&")[0];
      console.log(id);
      setVideoId(id);
    };
    getVideoId();
  }, []);
  const fetchData = async () => {
    const url = `https://0cbzh110-5000.inc1.devtunnels.ms/summary/${videoId}`;
    console.log(url);
    try {
      setLoading(true);
      const response = await axios.get(url);
      const response2 = await axios.get(
        `https://0cbzh110-5000.inc1.devtunnels.ms/sentiment/${videoId}`
      );
      const { data } = response;
      const { data: data2 } = response2;

      data2.forEach((element) => {
        if (element.label === "positive") {
          setHappy((prev) => prev + 1);
        } else if (element.label === "neutral") {
          setNeutral((prev) => prev + 1);
        } else {
          setSad((prev) => prev + 1);
        }
      });

      setSummary(data.summary);
      setLoading(false);
      chrome.storage.local.set({
        summary: data.summary,
      });
      doSomething();
    } catch (error) {
      console.error("Error fetching video details:", error);
      setSummary("Error fetching video details");
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   doSomething();
  // }, [summary]);

  const doSomething = async () => {
    let [tab] = await chrome.tabs.query({ active: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        chrome.storage.local.get(["summary"], (res) => {
          document.getElementById("secondary").innerHTML = `
         <div className="column">
         <h1 className="head"
         style="
          font-size: "5rem",
          font-weight: "bold",
          color: "#242424",
          font-size: "4rem",
    "
         >Infoscribe.Ai</h1>
         <p className="para"
          style="
          font-size: 1.5rem;
          color: #000;
          text-align: start;
          margin-bottom: 1rem;
          "
         >
         ${res.summary}
         </p>
          <div style="height: 400px;">
          <iframe
          src='http://localhost:3000/'
          width="100%"
          height="90%"
        ></iframe></div>
         </div>
          `;
          //document.getElementById("contents").textContent = "hllo";
        });
      },
    });
  };

  // const id = "1";
  if (loading)
    return (
      <div className="">
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
      </div>
    );

  return (
    <div className="flex flex-col items-center">
      <Logo />
      <button
        onClick={
          () => fetchData()
          // videoId != ""
          //   ? window.open(`http://localhost:5173/video/${videoId}/0`, "_blank")
          //   : alert("Please open a youtube video")
        }
        className=" h-12 text-white font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg shadow-lg hover:scale-105 duration-200 hover:drop-shadow-2xl hover:shadow-purple-800 hover:cursor-pointer"
      >
        Get Help With this Video
      </button>

      <div className="w-full flex flex-wrap items-center justify-center gap-4 mt-8 text-white">
        <div className="flex gap-2 items-center">
          {" "}
          <div className="h-4 w-4 rounded-full bg-green-400"></div>
          <h3 className="">Positive - {happy}</h3>
        </div>
        <div className="flex gap-2 items-center">
          {" "}
          <div className="h-4 w-4 rounded-full bg-red-400"></div>
          <h3 className="">Negative - {sad}</h3>
        </div>
        <div className="flex gap-2 items-center">
          {" "}
          <div className="h-4 w-4 rounded-full bg-gray-400"></div>
          <h3 className="">Neutral - {neutral}</h3>
        </div>
      </div>
    </div>
  );
}

export default App;

// {
//   "name": "My YT Bookmarks",
//   "version": "0.1.0",
//   "description": "Saving timestamps in YT videos",
//   "permissions": ["storage", "tabs"],
//   "host_permissions": ["https://*.youtube.com/*"],
//   "background": {
//     "service_worker": "background.js"
//   },
//   "content_scripts": [
//     {
//       "matches": ["https://*.youtube.com/*"],
//       "js": ["contentScript.js"]
//     }
//   ],
//   "web_accessible_resources": [
//     {
//       "resources": [
//         "assets/bookmark.png",
//         "assets/play.png",
//         "assets/delete.png",
//         "assets/save.png"
//       ],
//       "matches": ["https://*.youtube.com/*"]
//     }
//   ],
//   "action": {
//     "default_icon": {
//       "16": "assets/ext-icon.png",
//       "24": "assets/ext-icon.png",
//       "32": "assets/ext-icon.png"
//     },
//     "default_title": "My YT Bookmarks",
//     "default_popup": "popup.html"
//   },
//   "manifest_version": 3,
//   "chrome_url_overrides": {
//     "newtab": "index.html"
//   }
// }
