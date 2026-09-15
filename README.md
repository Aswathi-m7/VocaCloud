````markdown
# VocaCloud

VocaCloud is a web application that converts an audio recording into a transcript and a visual word cloud. The user can either record audio directly in the browser or upload an existing audio file. The audio is analyzed using Google's Gemini API, which generates the transcript and identifies the prominent topics and terms discussed.

## Features

- Record audio directly from the browser
- Display recording status and elapsed recording time
- Play back recorded audio
- Discard a recording and record again
- Upload an existing audio file
- Validate uploaded audio files before analysis
- Display selected file name, size, and duration
- Support multiple audio formats
- Maximum file size of 25 MB
- Maximum audio duration of 10 minutes
- Transcribe audio using the Gemini API
- Extract prominent topics and terms from the transcript
- Remove common filler words and stopwords
- Count selected terms
- Generate a frequency-based word cloud
- Download the word cloud as a PNG
- Display upload progress during analysis
- Handle microphone and file validation errors
- Handle API/analysis failures
- Prevent recording and uploading at the same time
- Responsive layout for smaller screens

## Technologies Used

- Next.js
- React
- JavaScript
- CSS Modules
- Google Gemini API
- `@google/genai`
- `html-to-image`

## Project Structure

```text
VocaCloud/
│
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.js
│   │
│   ├── components/
│   │   ├── AudioRecorder.jsx
│   │   ├── AudioUploader.jsx
│   │   └── WordCloud.jsx
│   │
│   ├── page.js
│   ├── page.module.css
│   ├── globals.css
│   └── layout.js
│
├── lib/
│   ├── audioValidation.js
│   └── constants.js
│
├── public/
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
````

## Getting Started

### Prerequisites

Make sure the following are installed:

* Node.js
* npm
* A Google Gemini API key

### 1. Clone the repository

```bash
git clone <https://github.com/Aswathi-m7/VocaCloud>
cd VocaCloud
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the Gemini API key

Create a file named:

```text
.env.local
```

Add the following:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Replace `your_gemini_api_key` with your actual Gemini API key.

The API key is used by the server-side API route and is not hard-coded into the application.

Do not commit `.env.local` to GitHub.

### 4. Start the development server

```bash
npm run dev
```

Open the application in your browser:

```text
http://localhost:3000
```

## Environment Variables

The application requires:

| Variable         | Purpose                                         |
| ---------------- | ----------------------------------------------- |
| `GEMINI_API_KEY` | Used to authenticate requests to the Gemini API |

A sample environment file can be provided as:

```text
.env.example
```

Example:

```env
GEMINI_API_KEY=your_gemini_api_key
```

The actual API key should only be stored in `.env.local` or in the environment variables of the deployment platform.

## How the Application Works

The main workflow of VocaCloud is:

```text
Record / Upload Audio
        ↓
Validate Audio
        ↓
Check Format, Size and Duration
        ↓
User Starts Analysis
        ↓
Audio Sent to /api/analyze
        ↓
Gemini Processes Audio
        ↓
Transcript + Important Terms
        ↓
Term Frequency
        ↓
Word Cloud
        ↓
Download Word Cloud as PNG
```

## Audio Recording

The application allows users to record audio directly using the browser microphone.

The recording interface provides:

* Start recording
* Recording indicator
* Recording duration
* Stop recording
* Audio playback
* Discard recording

The maximum recording duration is:

```text
10 minutes
```

If microphone permission is denied or microphone access is not available, an error message is displayed.

## Audio Upload

Users can also choose an existing audio file from their device.

The uploaded file is checked before it is sent to the server.

The application checks:

* Audio format
* File size
* Audio duration

### Supported Audio Formats

The supported formats are:

* MP3
* WAV
* M4A
* AAC
* OGG
* WEBM
* FLAC

### File Size Limit

The maximum supported file size is:

```text
25 MB
```

Files larger than this limit are rejected.

### Duration Limit

The maximum supported audio duration is:

```text
10 minutes
```

Files longer than 10 minutes are rejected.

### File Information

After selecting a file, the application displays information such as:

* File name
* File size
* Audio duration

The user can remove the selected file before starting the analysis.

## Input State Handling

Only one audio input can be active at a time.

If a recording has been created:

```text
Upload → Disabled
```

If a file has been uploaded:

```text
Record → Disabled
```

While analysis is running, both input methods are disabled.

This prevents the user from accidentally selecting or recording multiple audio sources at the same time.

## Gemini Audio Analysis

VocaCloud uses the Google Gemini API to process the selected audio.

The audio is sent to the following Next.js API endpoint:

```text
POST /api/analyze
```

Gemini is instructed to:

1. Transcribe the audio.
2. Identify prominent topics and terms.
3. Remove filler words and common stopwords.
4. Combine obvious variations of the same term where appropriate.
5. Keep meaningful multi-word phrases.
6. Count the selected terms.
7. Return the result in JSON format.

The expected response structure is:

```json
{
  "transcript": "full transcript here",
  "terms": [
    {
      "word": "example",
      "count": 3
    }
  ]
}
```

## Word Cloud

The extracted terms are displayed visually as a word cloud.

The size of each term is based on its frequency in the transcript.

More frequently occurring terms are displayed using a larger font size, while less frequent terms are displayed using a smaller font size.

A logarithmic scaling approach is used for the font size so that very frequent terms do not completely dominate the visualization.

## Downloading the Word Cloud

The generated word cloud can be downloaded as a PNG image.

The application uses the `html-to-image` package to convert the word-cloud element into an image.

The downloaded file is named:

```text
vocacloud-word-cloud.png
```

The generated PNG uses a white background and increased pixel density for better image quality.

## Upload Progress

During the audio analysis request, the application displays the upload progress.

For example:

```text
Uploading and analyzing: 25%
```

The progress percentage represents the browser-side upload of the audio file.

After the upload reaches 100%, Gemini may still require some time to complete the audio analysis.

## Error Handling

VocaCloud handles several common error conditions.

### Microphone Permission Error

If microphone access is denied or unavailable, the application displays an appropriate error message.

### Unsupported File

If the selected file is not a supported audio format, the user is asked to upload a supported format.

### File Too Large

Files larger than 25 MB are rejected.

### Audio Too Long

Audio longer than 10 minutes is rejected.

### Invalid Audio

If the browser cannot read the audio metadata, the application reports that the file could not be read and asks the user to try another file.

### API Failure

If the Gemini/API request fails, the application displays an error message instead of failing silently.

## Security

The Gemini API key is stored in an environment variable:

```text
GEMINI_API_KEY
```

The key is not included directly in the React client-side code.

The `.env.local` file should not be committed to the Git repository.

For deployment, the API key should be added through the hosting platform's environment variable settings.

## Brief Reference

The application includes the required brief reference metadata in the root layout:

```html
<meta name="x-brief-ref" content="TFG-WD-8823">
```

This is configured through Next.js metadata.

## Testing

The main application flow was tested using the following process:

```text
Audio Selection
      ↓
Audio Validation
      ↓
Analysis
      ↓
Transcript Generation
      ↓
Term Extraction
      ↓
Word Cloud Generation
      ↓
PNG Download
```

The input state was also tested to make sure that recording and uploading cannot be performed simultaneously.

The responsive layout was checked for smaller screen sizes.

## Known Limitations

* Gemini API availability is required for audio analysis.
* Analysis time can vary depending on the audio length and API response time.
* Browser microphone permissions can affect the recording functionality.
* Audio MIME types can sometimes be reported differently by different browsers.
* The word cloud represents prominent extracted terms and is not intended to be a complete linguistic analysis of every word.
* The upload progress percentage represents file upload progress and does not represent Gemini's internal processing progress.
* Very low-volume speech or poor-quality recordings may produce less accurate transcripts.

## Production Build

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## Deployment

The application can be deployed on a Next.js-compatible hosting platform.

When deploying, configure the following environment variable:

```text
GEMINI_API_KEY
```

The API key should be added through the deployment platform's environment-variable configuration and should not be committed to the repository.

## Author

Developed by Aswathi M for project/task submission for Finquo Junior HR.

**Project Name:** VocaCloud

**Purpose:** Audio transcription, topic extraction, and visual word-cloud generation.

```