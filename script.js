const BASE_PATH = "https://zhining-gis.github.io/user_survey/"
const DATA_URL = "data.json";

let allIDs = [];
let dataMap = {};
let currentIndex = 0;
const username = document.getElementById("username").value.trim();
if (!username) {
  alert("Please enter your name or ID.");
}

fetch(DATA_URL)
  .then((res) => res.json())
  .then((data) => {
    dataMap = data;
    allIDs = Object.keys(data).sort(); // make sure all IDs are in the same order
    updateProgress();
    if (allIDs.length > 0) {
      renderCurrent();
    } else {
      document.body.innerHTML = "<h2>No data found in data.json</h2>";
    }
  })
  .catch((err) => {
    console.error("Failed to load data.json", err);
    document.body.innerHTML = "<h2>❌ Error: Cannot load data.json</h2>";
  });

function updateProgress() {
  document.getElementById("progress").textContent = `${currentIndex + 1}/${
    allIDs.length
  }`;
}

function renderCurrent() {
  const id = allIDs[currentIndex];
  document.getElementById("current-id").textContent = id;

  const files = dataMap[id];
  const container = document.getElementById("image-container");
  container.innerHTML = "";
  // Three images
  files.forEach((filename, idx) => {
    const div = document.createElement("div");
    div.className = "image-item";
    if (idx == 0) {
      const encodedName = encodeURIComponent(filename);
      div.innerHTML = `
          <img src="images/SD3_original/${encodedName}" alt="Class ${idx + 1}" >
          <div>Class ${idx + 1}</div>
        `;
    } else if (idx == 1) {
      div.innerHTML = `   
          <img src="./images/SD3_prompt_eng/${filename}" alt="Class ${
        idx + 1
      }" >
          <div>Class ${idx + 1}</div>
        `;
    } else if (idx == 2) {
      div.innerHTML = `
          <img src="./images/SD3_selfcross_woINITNO/${filename}" alt="Class ${
        idx + 1
      }" >
          <div>Class ${idx + 1}</div>
        `;
    }
    container.appendChild(div);
  });

  // 清空表单
  document
    .querySelectorAll('input[type="radio"]')
    .forEach((r) => (r.checked = false));
  document.getElementById("nextBtn").disabled = true;
}

// Response Form
document.addEventListener("change", function (e) {
  if (e.target.matches('input[type="radio"]')) {
    const q1 = document.querySelector('input[name="q1"]:checked');
    const q2 = document.querySelector('input[name="q2"]:checked');
    const q3 = document.querySelector('input[name="q3"]:checked');
    const q4 = document.querySelector('input[name="q4"]:checked');
    const q5 = document.querySelector('input[name="q5"]:checked');
    const q6 = document.querySelector('input[name="q6"]:checked');
    // enable submission button when both q1 and q2 are answered.
    document.getElementById("nextBtn").disabled = !(q1 && q2 && q3 && q4 && q5 && q6);
  }
});

// Submission
document
  .getElementById("response-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const imageID = allIDs[currentIndex];
    const q1 = document.querySelector('input[name="q1"]:checked').value;
    const q2 = document.querySelector('input[name="q2"]:checked').value;
    const q3 = document.querySelector('input[name="q3"]:checked').value;
    const q4 = document.querySelector('input[name="q4"]:checked').value;
    const q5 = document.querySelector('input[name="q5"]:checked').value;
    const q6 = document.querySelector('input[name="q6"]:checked').value;

    const username = document.getElementById("username").value.trim() || "anonymous";

    const statusDiv = document.getElementById("status-message");
    const nextBtn = document.getElementById("nextBtn");
    nextBtn.disabled = true;
    statusDiv.textContent = "📤 Submitting ...";

    const WEB_APP_URL =
      "https://script.google.com/macros/s/AKfycbxw4oyMmxfLYehccWDe90IGJy7XMGYHCQiK0dohGZyznNfV-zTg-_5GlNjIBnJ9Txj0Vw/exec";
    fetch(WEB_APP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageID: imageID,
        username: username,
        question1: q1,
        question2: q2, 
        question3: q3,
        question4: q4, 
        question5: q5,
        question6: q6, 
      }),
    })
      .then(() => {
        console.log("Submitted Results.");

        statusDiv.textContent = ""
        // statusDiv.style.color = "#4CAF50";

        currentIndex++;
        if (currentIndex < allIDs.length) {
          updateProgress();
          renderCurrent();
        } else {
          document.body.innerHTML = `
              <h2>🎉 Thanks for answering evaluation for all ${allIDs.length} image groups!</h2>
              <p>Your feedback is important to us!</p>`;
        }
      })
      .catch((err) => {
        console.error("Submission Failed", err);
        alert("Submission failed, please try it again!");
      });

    // go to next group
  });