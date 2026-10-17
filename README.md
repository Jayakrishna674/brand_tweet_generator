# Confluencr AI Brand Tweet Generator

An AI-powered web application that analyzes a brand's voice from user-provided details and generates 10 varied tweets for different campaign objectives.

## Features

- Generates a brand voice summary with four categories.
- Creates exactly 10 tweets in four content styles.
- Supports engagement, promotion, and awareness objectives.
- Offers multiple brand tone options.
- Validates tweet length, content categories, and duplicate tweets.
- Provides a simple web interface for generating and reviewing tweets.

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Python and Flask
- **AI Model:** Google Gemini API (`gemini-2.5-flash` by default)
- **Deployment:** Render
- **Dependencies:** Flask, Google Gen AI SDK, Gunicorn

## Run Locally on Windows

### 1. Install Python

Install Python 3.10 or later.

### 2. Open the project folder

Open the project folder in VS Code and open a terminal inside it.

### 3. Create a virtual environment

```bat
python -m venv venv
```

Activate it in Command Prompt:

```bat
venv\Scripts\activate.bat
```

### 4. Install dependencies

```bat
python -m pip install -r requirements.txt
```

### 5. Configure the Gemini API key

Create a Gemini API key through Google AI Studio. Set it as an environment variable in your terminal.

For Command Prompt:

```bat
set GEMINI_API_KEY=YOUR_NEW_API_KEY
```

Replace `YOUR_NEW_API_KEY` with your own key. Do not commit the key to GitHub or include it in source code.

### 6. Start the application

```bat
python app.py
```

### 7. Open the application

Visit [http://127.0.0.1:5000](http://127.0.0.1:5000) in your browser.

## Deployment

The application can be deployed on Render using Gunicorn.

Configure the following environment variable in your Render service:

- `GEMINI_API_KEY`: Your Gemini API key.

The application uses the `GEMINI_MODEL` environment variable to select the model. The default is `gemini-2.5-flash`.

Set the start command to:

```text
gunicorn app:app
```

Add the API key through Render's Environment settings. Never expose it in frontend JavaScript, HTML, or a public repository.

## Brand Voice Analysis

The application infers a suitable brand voice from the brand name, industry, product or service details, campaign objective, and preferred tone.

The summary covers:

1. Tone and personality
2. Target audience
3. Content themes
4. Writing style

The application does not scrape or independently analyze existing social media posts.

## Tweet Generation

The application generates 10 tweets across four styles:

- Engaging / Conversational
- Promotional
- Witty / Meme-style
- Informative / Value-driven

It checks the tweet count, content categories, character limits, and duplicate text before returning the results.

## Project Structure

```text
brand-tweet-generator/
├── app.py
├── requirements.txt
├── README.md
├── templates/
│   └── index.html
├── static/
│   ├── style.css
│   └── script.js
└── .gitignore
```

## Limitations

- Brand voice is inferred from the information supplied by the user, rather than scraped social media history.
- AI-generated content may require human review for accuracy, originality, and brand suitability.
- Generation requires a valid Gemini API key and an available model.

## Evaluation and Testing

Test the application with two different brands and compare the generated voice summaries and tweets for relevance, tone consistency, creativity, and variation.

## Live Demo

Add the verified public Render URL here after confirming that tweet generation works successfully.

## Source Code

Add the GitHub repository URL here.