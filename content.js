 chrome.storage.local.get(["dailySolved", "blockedSites"], (res) => {
  if (res.dailySolved) return;

  const blockedSites = res.blockedSites || [];
  const current = location.hostname;

  if (blockedSites.some(site => current.includes(site))) {

    // 🔁 TRIGGER RECHECK WHEN BLOCKED SITE OPENS
    chrome.runtime.sendMessage({ type: "CHECK_NOW" });

    document.body.innerHTML = `
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
          background: #ffffff;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          color: #1a1a1a;
        }
        .blocker {
          text-align: center;
          background: #f8f8f8;
          border-radius: 16px;
          padding: 60px 40px;
          max-width: 550px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          border: 1px solid #e8e8e8;
          animation: slideIn 0.5s ease-out;
        }
        .emoji {
          font-size: 70px;
          margin-bottom: 24px;
        }
        h1 {
          font-size: 28px;
          margin-bottom: 12px;
          font-weight: 700;
        }
        p {
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 20px;
        }
        a {
          display: inline-block;
          background: #000;
          color: #fff;
          padding: 14px 40px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
        }
      </style>

      <div class="blocker">
        <div class="emoji">🚫</div>
        <h1>Solve Today’s LeetCode Problem First</h1>
        <p>This site is blocked until you complete today’s challenge.</p>
        <a href="https://leetcode.com/problemset/">Go to LeetCode →</a>
      </div>
    `;
  }
});
