/* import assert from "node:assert";
import test from "node:test"; */
import {
  countUsers,
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
// TESTS 1: countUsers
// ============================================================
/* test("User count is correct", () => {
  assert.equal(countUsers(), 4);
}); */
test("User count is correct", () => {
  expect(countUsers()).toBe(4);
});

// ============================================================
// TESTS 2: songByCount
// ============================================================
describe("songByCount", () => {
  test("user 1 returns The Swell Season - When Your Mind's Made Up", () => {
    expect(songByCount("1")).toBe(
      "The Swell Season - When Your Mind's Made Up",
    );
  });
});

// ============================================================
// TESTS 3: artistByCount
// ============================================================
describe("artistByCount", () => {
  test("user 2 returns Frank Turner", () => {
    expect(artistByCount("2")).toBe("Frank Turner");
  });
});

// ============================================================
// TESTS 4: fridayNightSongByCount
// ============================================================
describe("fridayNightSongByCount", () => {
  test("user 3 returns null (no friday listens)", () => {
    expect(fridayNightSongByCount("3")).toBeNull();
  });
});

// ============================================================
// TESTS 5: songByTime
// ============================================================
describe("songByTime", () => {
  test("user 1 returns Faithless - Insomnia)", () => {
    expect(songByTime("1")).toBe("Faithless - Insomnia");
  });
});

// ============================================================
// TESTS 6:   artistByTime
// ============================================================
describe("artistByTime", () => {
  test("user 2 returns Frank Turner", () => {
    expect(artistByTime("2")).toBe("Frank Turner");
  });
});

// ============================================================
// TESTS 7:   fridayNightSongByTime
// ============================================================
describe("fridayNightSongByTime", () => {
  test("user 3 returns null)", () => {
    expect(fridayNightSongByTime("3")).toBeNull();
  });
});

// ============================================================
// TESTS 8:   getLongestStreak
// ============================================================
describe("getLongestStreak", () => {
  test("user 1 — song is The King Blues - I Got Love", () => {
    expect(getLongestStreak("1").label).toBe("The King Blues - I Got Love");
  });

  test("user 1 — streak count is 34", () => {
    expect(getLongestStreak("1").count).toBe(34);
  });
});

// ============================================================
// TESTS 9:  getEverydaySongs
// ============================================================
describe("getEverydaySongs", () => {
  test("user 2 includes Frank Turner - Photosynthesis", () => {
    expect(getEverydaySongs("2")).toContain("Frank Turner - Photosynthesis");
  });

  test("user 2 includes The Divine Comedy - Tonight We Fly", () => {
    expect(getEverydaySongs("2")).toContain(
      "The Divine Comedy - Tonight We Fly",
    );
  });
});

// ============================================================
// TESTS 10:   genres
// ============================================================
describe("genres", () => {
  test("user 3 returns ['Pop', 'Folk', 'House']", () => {
    expect(genres("3")).toEqual(["Pop", "Folk", "House"]);
  });

  test("user 4 returns empty array", () => {
    expect(genres("4")).toEqual([]);
  });
});
