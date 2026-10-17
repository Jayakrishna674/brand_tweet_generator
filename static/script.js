
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

const loadingMessages = [
    "Analyzing your brand voice...",
    "Finding creative angles...",
    "Crafting your tweet ideas...",
    "Refining your content..."
];

let loadingInterval;


// Generate tweets when the form is submitted
form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(form);

    const brandData = {
        brand: formData.get("brand").trim(),
        industry: formData.get("industry").trim(),
        objective: formData.get("objective"),
        products: formData.get("products").trim(),
        tone: formData.get("tone")
    };

    if (!brandData.products) {
        showError("Please describe your brand's products or services.");
        return;
    }

    hideError();
    results.hidden = true;
    emptyState.hidden = true;
    loadingState.hidden = false;

    generateBtn.disabled = true;
    buttonLabel.textContent = "Creating your tweets...";

    startLoadingMessages();

    try {
        const response = await fetch("/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(brandData)
        });

        let data;

        try {
            data = await response.json();
        } catch {
            throw new Error(
                "The server returned an invalid response. Please try again."
            );
        }

        if (!response.ok) {
            throw new Error(
                data.error || "Unable to generate tweets. Please try again."
            );
        }

        // Validate the response structure.
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

        const validSummary = data.voice_summary.every(function (point) {
            return typeof point === "string" && point.trim() !== "";
        });

        const validTweets = data.tweets.every(function (tweet) {
            return (
                tweet &&
                typeof tweet.text === "string" &&
                tweet.text.trim() !== "" &&
                tweet.text.length <= 280 &&
                typeof tweet.type === "string"
            );
        });

        if (!validSummary || !validTweets) {
            throw new Error(
                "Some generated content is invalid. Please try again."
            );
        }

        displayResults(data);

    } catch (error) {
        showError(
            error.message || "Something went wrong. Please try again."
        );

        emptyState.hidden = false;

    } finally {
        stopLoadingMessages();
        loadingState.hidden = true;
        generateBtn.disabled = false;
        buttonLabel.textContent = "✦ Generate 10 Tweets";
    }
});


// Rotate loading messages without pretending to show actual progress.
function startLoadingMessages() {
    const loadingHeading = loadingState.querySelector("h3");
    let messageIndex = 0;

    loadingHeading.textContent = loadingMessages[messageIndex];

    loadingInterval = setInterval(function () {
        messageIndex = (messageIndex + 1) % loadingMessages.length;
        loadingHeading.textContent = loadingMessages[messageIndex];
    }, 2200);
}


function stopLoadingMessages() {
    if (loadingInterval) {
        clearInterval(loadingInterval);
        loadingInterval = null;
    }
}


// Display the brand voice summary and generated tweets.
function displayResults(data) {
    voiceSummary.replaceChildren();
    tweetList.replaceChildren();

    generatedTweets = data.tweets;

    data.voice_summary.forEach(function (point) {
        const item = document.createElement("li");
        item.textContent = point;
        voiceSummary.appendChild(item);
    });

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
        copyButton.setAttribute(
            "aria-label",
            "Copy tweet " + (index + 1)
        );

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

    // Bring the generated content into view on smaller screens.
    if (window.matchMedia("(max-width: 850px)").matches) {
        results.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}


// Copy all 10 tweets.
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


// Copy text to the clipboard.
async function copyText(text, button) {
    const originalText = button.textContent;

    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
        } else {
            // Fallback for local development or unsupported browsers.
            const temporaryInput = document.createElement("textarea");
            temporaryInput.value = text;
            temporaryInput.style.position = "fixed";
            temporaryInput.style.opacity = "0";

            document.body.appendChild(temporaryInput);
            temporaryInput.select();

            const copied = document.execCommand("copy");
            temporaryInput.remove();

            if (!copied) {
                throw new Error("Clipboard copy failed");
            }
        }

        hideError();
        button.textContent = "✓ Copied!";

        setTimeout(function () {
            button.textContent = originalText;
        }, 1500);

    } catch (error) {
        showError(
            "Copy failed. Please select and copy the text manually."
        );
    }
}


// Show an error message.
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.hidden = false;
}


// Clear the error message.
function hideError() {
    errorMessage.textContent = "";
    errorMessage.hidden = true;
}
