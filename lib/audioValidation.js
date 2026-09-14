import { BRIEF_REF_5190_MAX_BYTES } from "./constants";

const SUPPORTED_AUDIO_TYPES = [
  "audio/mpeg",
  "audio/wav",
  "audio/x-wav",
  "audio/mp4",
  "audio/x-m4a",
];

export function validateAudioFile(file) {
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

  return {
    valid: true,
    message: "",
  };
}