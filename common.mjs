import { getUserIDs, getListenEvents, getSong } from "./data.mjs";

export const countUsers = () => getUserIDs().length;

// ============================================================
//HElPER FUNCTIONS
// get all listen events enriched with song details
export function getEnrichedEvents(userID) {
  const events = getListenEvents(userID);
  return events.map((event) => ({
    ...event,
    song: getSong(event.song_id),
  }));
}

// find the most frequent item in an array of values
export function getMostFrequent(values) {
  if (values.length === 0) return null;

  const counts = {};
  for (const val of values) {
    counts[val] = (counts[val] || 0) + 1;
  }
  return counts;
}

// find the item with highest total time
export function getMostByTime(items) {
  if (items.length === 0) return null;

  const totals = {};
  for (const { key, seconds } of items) {
    totals[key] = (totals[key] || 0) + seconds;
  }

  return Object.entries(totals).sort((a, b) => b[1] - a[1])[0][0];
}

//check if a listen event falls on a Friday night (17:00-4:00)
export function isFridayNight(event) {
  const date = new Date(event.timestamp);
  const dat = date.getDay(); // 5=fri, 6=sat
  const secs = event.seconds_since_midnight;

  const isFridayEvening = day === 5 && secs >= 61200; //after Friday 17:00
  const isSaturdayEarlyMorning = day === 6 && secs > 14400; //before Saturday 04:00

  return isFridayEvening || isSaturdayEarlyMorning;
}

// ============================================================
// QUESTIONS
// 1. What was the user's most often listened to song according to the data?
export function getMostListenedSongByCount(userID) {
  const events = getEnrichedEvents(userID);
  if (events.length === 0) return null;

  const songLabels = events.map((e) => `${e.song.artist} - ${e.song.title}`);

  return getMostFrequent(songLabels);
}

// 2. What was the user's most often listened to artist according to the data?
export function getMostListenedArtistByCount(userID) {
  const events = getEnrichedEvents(userID);
  if (events.length === 0) return null;

  const artists = events.map((e) => e.song.artist);
  return getMostFrequent(artists);
}

// 3. What was the user's most often listened to song on Friday nights (between 5pm and 4am)?
export function getMostListenedFridayNightSongByCount(userID) {
  const events = getEnrichedEvents(userID);
  const fridayEvents = events.filter(isFridayNight);
  if (fridayEvents.length === 0) return null;
  const songLabels = fridayEvents.map(
    (e) => `${e.song.artist} - ${e.song.title}`,
  );
  return getMostFrequent(songLabels);
}

// 4. What are the answers to the above questions if using _listening time_ rather than _number of listens_?
// 4.1 Most listened song by time
export function getMostListenedSongByTime(userID) {
  const events = getEnrichedEvents(userID);
  if (events.length === 0) return null;

  const items = events.map((e) => ({
    key: `${e.song.artist} - ${e.song.title}`,
    seconds: e.song.duration_seconds,
  }));
  return getMostByTime(items);
}
// 4.2 Most listened artist by time
export function getMostListenedArtistByTime(userID) {
  const events = getEnrichedEvents(userID);
  if (events.length === 0) return null;

  const items = events.map((e) => ({
    key: e.song.artist,
    seconds: e.song.duration_seconds,
  }));

  return getMostByTime(items);
}

// 4.3 Most listened song on friday night by time
export function getMostListenedFridayNightSongByTime(userID) {
  const events = getEnrichedEvents(userID);
  const fridayEvents = events.filter(isFridayNight);
  if (fridayEvents.length === 0) return null;

  const items = fridayEvents.map((e) => ({
    key: `${e.song.artist} - ${e.song.title}`,
    seconds: e.song.duration_seconds,
  }));

  return getMostByTime(items);
}

// 5. What song did the user listen to the most times in a row (i.e. without any other song being listened to in between)? How many times was it listened to?
export function getLongestStreak(userID) {
  const events = getEnrichedEvents(userID);
  if (events.length === 0) return null;

  let maxCount = 0;
  let maxSongID = null;
  let currentSongID = null;
  let currentCount = 0;

  for (const event of events) {
    if (event.song_id === currentSongID) {
      currentCount++;
    } else {
      currentSOngID = event.song_id;
      currentCOunt = 1;
    }

    if (currentCount > maxCount) {
      maxCount = currentCount;
      maxSondId = currentSongID;
    }
  }

  const song = getSong(maxSongID);
  return {
    label: `${song.artist} - ${song.title}`,
    count: maxCount,
  };
}

// 6. Are there any songs that, on each day the user listened to music, they listened to every day? If the answer is yes, you should show which one(s). If the answer is no, you should not show anything about this question.
export function getEverydaySongs(userID) {
  const events = getEnrichedEvents(userID);
  if (events.length === 0) return [];

  const dayMap = {};
  for (const event of events) {
    // Extract date portion from timestamp "2024-08-01T00:20:07" → "2024-08-01"
    const dateKey = event.timestamp.slice(0, 10);
    if (!dayMap[dateKey]) dayMap[dateKey] = new Set();
    dayMap[dateKey].add(`${event.song.artist} - ${event.song.title}`);
  }

  const days = Object.values(dayMap);
  const totalDays = days.length;
  // Get all unique song labels
  const allSongs = new Set(
    events.map((e) => `${e.song.artist} - ${e.song.title}`),
  );

  // Keep only songs that appear in EVERY day's set
  const everydaySongs = [...allSongs].filter((song) =>
    days.every((daySet) => daySet.has(song)),
  );

  return everydaySongs; // empty array = no everyday songs → hide the question
}

// 7. What were the user's top three genres to listen to by number of listens? */
export function getTopGenres(userID) {
  const events = getEnrichedEvents(userID);
  if (events.length === 0) return [];

  // Count listens per genre
  const counts = {};
  for (const event of events) {
    const genre = event.song.genre;
    counts[genre] = (counts[genre] || 0) + 1;
  }

  // Sort by count descending, take top 3
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([genre]) => genre);
}
