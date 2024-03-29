import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [videoId, setVideoId] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");

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
      const { data } = response;
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
          document.getElementById("secondary").textContent = res.summary;
          document.getElementById("contents").textContent = "hllo";
        });
      },
    });
  };

  // const id = "1";
  if (loading) return <h1>Loading...</h1>;

  return (
    <>
      <h1 className="flex flex-col items-center font-bold text-4xl">
        <img
          src="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/3c662b51418913.58ecfcd8b6b18.png"
          alt="react logo"
          width="50"
        />
        Study Buddy{" "}
      </h1>
      {summary && <p>{summary}</p>}

      <button
        onClick={
          () => fetchData()
          // videoId != ""
          //   ? window.open(`http://localhost:5173/video/${videoId}/0`, "_blank")
          //   : alert("Please open a youtube video")
        }
        className="bg-black mt-4
      focus:outline-none
      text-white border-none outline-none"
      >
        Get Help With this Video
      </button>
      <button
        onClick={
          () => doSomething()
          // videoId != ""
          //   ? window.open(`http://localhost:5173/video/${videoId}/0`, "_blank")
          //   : alert("Please open a youtube video")
        }
        className="bg-black mt-4
      focus:outline-none
      text-white border-none outline-none"
      >
        storage
      </button>
    </>
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
