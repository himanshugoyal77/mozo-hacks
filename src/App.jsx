import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [videoId, setVideoId] = useState("");

  useEffect(() => {
    const getVideoId = async () => {
      let [tab] = await chrome.tabs.query({ active: true });
      const id = tab.url.split("v=")[1].split("&")[0];
      setVideoId(id);
    };
    getVideoId();
  }, []);

  // const id = "1";
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
      <button
        onClick={() =>
          videoId != ""
            ? window.open(`http://localhost:5173/video/${videoId}/0`, "_blank")
            : alert("Please open a youtube video")
        }
        className="bg-black mt-4
      focus:outline-none
      text-white border-none outline-none"
      >
        Get Help With this Video
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
