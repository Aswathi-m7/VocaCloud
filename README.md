# VocaCloud

**Author:** Aswathi M

**Project:** VocaCloud – Audio to Word Cloud Web Application

**Live Demo:** https://voca-cloud.vercel.app

**GitHub:** https://github.com/Aswathi-m7/VocaCloud

## What I Built

VocaCloud is a web application that takes an audio recording and converts it into a transcript and a visual word cloud.

The application supports two ways of providing audio:

- Recording audio directly through the browser
- Uploading an existing audio file

Before analysis, uploaded audio is checked for supported format, file size, and duration. After the audio is submitted, the application sends it to the Gemini API for transcription and identification of prominent terms. The returned terms are displayed as a frequency-based word cloud.

### Currently Working

- Browser audio recording
- Recorded audio playback
- Discarding a recording
- Audio file upload
- Audio file validation
- File size limit of 25 MB
- Audio duration limit of 10 minutes
- Support for common audio formats
- Analysis using the Gemini API
- Audio transcription
- Extraction of prominent terms
- Frequency-based word cloud generation
- PNG download of the word cloud
- Upload/analysis status feedback
- Responsive mobile layout
- Prevention of recording and uploading another audio at the same time

The application does not currently include user accounts, persistent storage, or a database.

## How to Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/Aswathi-m7/VocaCloud.git
cd VocaCloud
````

### 2. Install dependencies

```bash
npm install
```

### 3. Create the environment file

Create a file named `.env.local` in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Replace `your_gemini_api_key` with your own Gemini API key.

The API key should not be committed to GitHub.

### 4. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### 5. Create a production build

```bash
npm run build
```

To run the production build locally:

```bash
npm start
```

## AI Service Used

VocaCloud uses the **Google Gemini API** for audio analysis.

Gemini was chosen because it can process the submitted audio and return both a transcript and meaningful terms from the conversation. This allowed the application to keep the audio-analysis part simple without implementing a separate speech-to-text service and a separate text-analysis service.

The Gemini API is only used when the user clicks **Analyze audio**.

## Development Decisions

### 1. Next.js

I used Next.js with the App Router because it provides the frontend structure as well as API routes in the same project. This kept the application relatively simple instead of creating separate frontend and backend projects.

### 2. Client-side audio validation

Audio format, file size, and duration are checked before sending the file for analysis. This prevents obviously invalid or oversized files from being sent to the API.

I also added restrictions so that the user cannot start another recording or select another file while an audio input is already selected or being analyzed.

### 3. Frequency-based word cloud

I used the term counts returned by the AI service to determine the font size of each word. More frequent terms are displayed larger than less frequent terms.

I deliberately kept the word-cloud generation simple instead of adding a separate word-cloud library.

### 4. Silent Audio Handling

I decided not to implement a separate silent-audio detection mechanism.

The application already validates the audio format, file size, and duration before analysis. Detecting whether an audio file actually contains meaningful speech would require additional audio-processing logic and threshold tuning. A simple volume-based check could also incorrectly reject valid recordings, especially when the speaker is quiet or the recording has low microphone volume.

For the scope of this project, I chose to keep the input validation focused on objective constraints that can be reliably checked and let the AI service handle the submitted audio. This keeps the application simpler while avoiding false rejection of valid recordings.

If I had another week, I would consider adding a more robust silence/speech detection step, such as voice-activity detection, and evaluate it against different recording conditions before integrating it.

## Libraries and External Components

The project uses the following libraries and frameworks:

* **Next.js** – application framework
* **React** – user interface
* **@google/genai** – Gemini API integration
* **Geist / Geist Mono** – fonts provided through `next/font`
* **ESLint** – code linting
* **babel-plugin-react-compiler** – React compiler support

The project was initially created using the Next.js `create-next-app` setup and was then modified for the VocaCloud requirements.

## AI Coding Assistance

I used AI coding assistance minimally during development, mainly for understanding implementation issues, debugging, and making small code improvements.

The application structure, feature integration, testing, and final implementation were manually reviewed and adjusted by me.

## Deployment

The application is deployed on Vercel.

**Live application:**

[https://voca-cloud.vercel.app](https://voca-cloud.vercel.app)

The Gemini API key is configured as an environment variable in the deployment environment and is not stored in the repository.

## What I Would Do Next

If I had another week, I would improve the project in the following areas:

* Silent Audio Handling
* Improve the word-cloud layout and term positioning
* Add better error messages and recovery states
* Add a history of previous analyses
* Add optional local or cloud storage for generated results
* Improve accessibility and keyboard navigation
* Add more testing for different audio formats and edge cases
* Improve the visual design for desktop and mobile screens
