
const form = document.getElementById("brand-form");
const generateBtn = document.getElementById("generate-btn");
const buttonLabel = document.getElementById("button-label");

const emptyState = document.getElementById("empty-state");
const loadingState = document.getElementById("loading-state");
const errorMessage = document.getElementById("error-message");
const results = document.getElementById("results");

const voiceSummary = document.getElementById("voice-summary");
const tweetList = document.getElementById("tweet-list");
const copyAllBtn = document.getElementById("copy-all-btn");

let generatedTweets = [];

// Generate tweets when the form is submitted
form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(form);

    const brandData = {
        brand: formData.get("brand"),
        industry: formData.get("industry"),
        objective: formData.get("objective"),
        products: formData.get("products"),
        tone: formData.get("tone")
    };

    hideError();
    results.hidden = true;
    emptyState.hidden = true;
    loadingState.hidden = false;

    generateBtn.disabled = true;
    buttonLabel.textContent = "Generating tweets...";

    try {
        const response = await fetch("/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(brandData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || "Unable to generate tweets. Please try again."
            );
        }

        // Check the response structure
        if (
            !Array.isArray(data.voice_summary) ||
            data.voice_summary.length !== 4 ||
            !Array.isArray(data.tweets) ||
            data.tweets.length !== 10
        ) {
            throw new Error(
                "The AI returned incomplete results. Please try again."
            );
        }

        // Check that every tweet has the required fields
        const validTweets = data.tweets.every(function (tweet) {
            return (
                tweet &&
                typeof tweet.text === "string" &&
                tweet.text.trim() !== "" &&
                typeof tweet.type === "string"
            );
        });

        if (!validTweets) {
            throw new Error(
                "Some generated tweets are invalid. Please try again."
            );
        }

        displayResults(data);

    } catch (error) {
        showError(
            error.message || "Something went wrong. Please try again."
        );

        emptyState.hidden = false;

    } finally {
        loadingState.hidden = true;
        generateBtn.disabled = false;
        buttonLabel.textContent = "✦ Generate 10 Tweets";
    }
});


// Display the brand voice summary and generated tweets
function displayResults(data) {
    voiceSummary.replaceChildren();
    tweetList.replaceChildren();

    generatedTweets = data.tweets;

    // Display the 4 brand voice points
    data.voice_summary.forEach(function (point) {
        const item = document.createElement("li");
        item.textContent = point;
        voiceSummary.appendChild(item);
    });

    // Display all 10 tweets
    data.tweets.forEach(function (tweet, index) {
        const card = document.createElement("article");
        card.className = "tweet-card";

        const top = document.createElement("div");
        top.className = "tweet-top";

        const number = document.createElement("span");
        number.className = "tweet-number";
        number.textContent =
            "TWEET " + String(index + 1).padStart(2, "0");

        const copyButton = document.createElement("button");
        copyButton.type = "button";
        copyButton.className = "copy-btn";
        copyButton.textContent = "Copy";

        copyButton.addEventListener("click", function () {
            copyText(tweet.text, copyButton);
        });

        top.append(number, copyButton);

        const type = document.createElement("span");
        type.className = "tweet-type";
        type.textContent = tweet.type;

        const text = document.createElement("p");
        text.className = "tweet-text";
        text.textContent = tweet.text;

        card.append(top, type, text);
        tweetList.appendChild(card);
    });

    results.hidden = false;
    emptyState.hidden = true;
}


// Copy all 10 tweets
copyAllBtn.addEventListener("click", async function () {
    if (generatedTweets.length === 0) {
        showError("Generate tweets before using Copy All.");
        return;
    }

    const allTweets = generatedTweets.map(function (tweet, index) {
        return (
            (index + 1) +
            ". [" + tweet.type + "] " +
            tweet.text
        );
    }).join("\n\n");

    await copyText(allTweets, copyAllBtn);
});


// Copy text to the clipboard
async function copyText(text, button) {
    const originalText = button.textContent;

    try {
        await navigator.clipboard.writeText(text);

        button.textContent = "Copied!";

        setTimeout(function () {
            button.textContent = originalText;
        }, 1500);

    } catch (error) {
        showError(
            "Copy failed. Please select and copy the text manually."
        );
    }
}


// Show an error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.hidden = false;
}


// Clear the error message
function hideError() {
    errorMessage.textContent = "";
    errorMessage.hidden = true;
}
