# Confluencr AI Brand Tweet Generator

A local AI web app that generates a brand voice summary and 10 varied tweets.

## Stack
- HTML, CSS, JavaScript
- Python + Flask
- Ollama local model (default: `llama3.2:3b`)

## Setup on Windows
1. Install Python 3.10+ and Ollama from https://ollama.com/download/windows
2. Open a terminal in this folder.
3. Download the model:
   ```powershell
   ollama pull llama3.2:3b
   ```
4. Create and activate a virtual environment:
   ```powershell
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```
   If PowerShell blocks activation, use Command Prompt:
   ```bat
   venv\Scripts\activate.bat
   ```
5. Install dependencies:
   ```powershell
   python -m pip install -r requirements.txt
   ```
6. Start the app:
   ```powershell
   python app.py
   ```
7. Open http://127.0.0.1:5000

## Choose another Ollama model
Set the `OLLAMA_MODEL` environment variable before running Flask. Example in PowerShell:
```powershell
$env:OLLAMA_MODEL="llama3.2:3b"
python app.py
```

## Notes
- Keep the Flask development server local; it is not configured for public deployment.
- The app infers brand voice from the user-provided details. It does not scrape social media posts.
- Review AI-generated content for accuracy before publishing.
