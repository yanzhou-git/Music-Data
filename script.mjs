// This is a placeholder file which shows how you can access functions defined in other files.
// It can be loaded into index.html.
// You can delete the contents of the file once you have understood how it works.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP e.g. with https://www.npmjs.com/package/http-server
// You can't open the index.html file using a file:// URL.

import { getUserIDs } from "./data.mjs";
import {
  songByCount,
  artistByCount,
  fridayNightSongByCount,
  songByTime,
  artistByTime,
  fridayNightSongByTime,
  getLongestStreak,
  getEverydaySongs,
  genres,
} from "./common.mjs";

// ============================================================
// FEATURE: Populate the user dropdown on page load
window.onload = function () {
  const select = document.getElementById("user-select");

  for (const id of getUserIDs()) {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = `User ${id}`;
    select.appendChild(option);
  }

  select.addEventListener("change", (e) => {
    const userID = e.target.value;
    const container = document.getElementById("stats-container");

    if (!userID) {
      container.innerHTML = "";
      return;
    }

    renderStats(userID, container);
  });
};
