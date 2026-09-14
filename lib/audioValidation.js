import {
  BRIEF_REF_5190_MAX_BYTES,
  MAX_RECORDING_SECONDS,
} from "./constants";

const SUPPORTED_AUDIO_TYPES = [
  "audio/mpeg",
  "audio/wav",
  "audio/x-wav",
  "audio/mp4",
  "audio/x-m4a",
];

export async function validateAudioFile(file) {
  if (!file) {
    return {
      valid: false,
      message: "Please choose an audio file.",
    };
  }

  if (!SUPPORTED_AUDIO_TYPES.includes(file.type)) {
    return {
      valid: false,
      message: "Please upload an MP3, WAV, or M4A audio file.",
    };
  }

  if (file.size > BRIEF_REF_5190_MAX_BYTES) {
    return {
      valid: false,
      message: "The audio file must be 25 MB or smaller.",
    };
  }

  const audioUrl = URL.createObjectURL(file);

  try {
    const duration = await getAudioDuration(audioUrl);

    if (duration > MAX_RECORDING_SECONDS) {
      return {
        valid: false,
        message: "The audio file must be 10 minutes or shorter.",
      };
    }

    return {
      valid: true,
      message: "",
    };
  } finally {
    URL.revokeObjectURL(audioUrl);
  }
}

function getAudioDuration(audioUrl) {
  return new Promise((resolve, reject) => {
    const audio = new Audio();

    audio.addEventListener("loadedmetadata", () => {
      resolve(audio.duration);
    });

    audio.addEventListener("error", () => {
      reject(new Error("Could not read the audio file."));
    });

    audio.src = audioUrl;
  });
}