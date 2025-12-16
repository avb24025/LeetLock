async function checkDailySolved(username, dailySlug) {
  const res = await fetch("https://leetcode.com/graphql/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      operationName: "recentAcSubmissions",
      query: `
        query recentAcSubmissions($username: String!, $limit: Int!) {
          recentAcSubmissionList(username: $username, limit: $limit) {
            titleSlug
            timestamp
          }
        }
      `,
      variables: {
        username,
        limit: 20
      }
    })
  });

  const data = await res.json();

  console.log(
  "Fetched submission data:",
  JSON.stringify(data, null, 2)
);

  const submissions = data?.data?.recentAcSubmissionList || [];

//   ✅ Check if daily problem slug exists
  return submissions.some(
    sub => sub.titleSlug === dailySlug
  );
}

async function getTodayDailySlug() {
  const res = await fetch("https://leetcode.com/graphql/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      operationName: "questionOfToday",
      query: `
        query questionOfToday {
          activeDailyCodingChallengeQuestion {
            question {
              title
              titleSlug
            }
          }
        }
      `,
      variables: {}
    })
  });

  const data = await res.json();

  return data?.data
    ?.activeDailyCodingChallengeQuestion
    ?.question
    ?.titleSlug;
}


async function runDailyCheck() {
  chrome.storage.local.get(["leetcodeUsername"], async (res) => {
    if (!res.leetcodeUsername) return;

    const dailySlug = await getTodayDailySlug();
    const solved = await checkDailySolved(res.leetcodeUsername, dailySlug);

    chrome.storage.local.set({
      dailySolved: solved,
      dailySlug,
      lastChecked: new Date().toDateString()
    });
  });
}

chrome.runtime.onStartup.addListener(runDailyCheck);
chrome.runtime.onInstalled.addListener(runDailyCheck);
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "CHECK_NOW") {
    console.log("🔁 Rechecking LeetCode status...");
    runDailyCheck();
  }
});
