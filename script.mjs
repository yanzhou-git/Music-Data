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

// ============================================================
// FEATURE: render all stats for a selected user

function renderStats(userID, container) {
  {
    container.innerHTML = "";

    //no data page
    const songCount = songByCount(userID);
    if (!songCount) {
      const msg = document.createElement("p");
      msg.textContent =
        "This user didn't listen to any songs. Please Come back later. ⌛️";
      container.appendChild(msg);
      return;
    }

    //Q1 + Q4.1: Most Listened Song, by count, by time
    addSection(container, "Most Listened Song", [
      { label: "By number of listens", value: songCount },
      { label: "By listening time", value: songByTime(userID) },
    ]);

    //Q2 + Q4.2: Most Listened Artist, by count, by time
    addSection(container, "Most Listened Artist", [
      { label: "By number of listens", value: artistByCount(userID) },
      { label: "By listening time", value: artistByTime(userID) },
    ]);

    //Q4 + Q4.3: Friday nights song, by count, by time
    const friCount = fridayNightSongByCount(userID);
    const friTime = fridayNightSongByTime(userID);
    if (friCount || friTime) {
      addSection(container, "Most Listened Song on Friday Nights", [
        { label: "By number of listens", value: friCount },
      ]);
    }

    //Q5: longest streak
    const streak = getLongestStreak(userID);
    if (streak && streak.count > 1) {
      addSection(container, "Longest Song Streak", [
        { label: streak.label, value: `${streak.count} times in a row` },
      ]);
    }

    //Q6: everyday songs
    const daily = getEverydaySongs(userID);
    if (daily.length > 0) {
      addSection(
        container,
        "Listened Every Day",
        daily.map((song) => ({
          label: song,
          value: "every day ✓",
        })),
      );
    }

    //Q7: top genres
    const topgenres = genres(userID);
    if (topgenres.length > 0) {
      const heading =
        topgenres.length === 1 ? "Top Genre" : `Top ${topgenres.length} Genres`;
      addSection(
        container,
        heading,
        topgenres.map((genre, i) => ({
          label: `#${i + 1}`,
          value: genre,
        })),
      );
    }
  }
}

// ============================================================
// HELPER: create and append a labelled stats section to the DOM
function addSection(container, heading, items) {
  const section = document.createElement("section");
  const h2 = document.createElement("h2");
  h2.textContent = heading;
  section.appendChild(h2);

  for (const { label, value } of items) {
    if (!value) continue;
    const p = document.createElement("p");
    p.innerHTML = `<strong>${label}:</strong> ${value}`;
    section.appendChild(p);
  }

  if (section.querySelectorAll("p").length > 0) {
    container.appendChild(section);
  }
}
