import whisper
import os
import logging

class WhisperTranscriber:
    def __init__(self, model_name: str = "base"):
        """
        Initialize the Whisper transcription handler.
        Args:
            model_name (str): The name of the Whisper model to use 
                              ("tiny", "base", "small", "medium", "large")
        """
        try:
            self.model = whisper.load_model(model_name)
        except Exception as e:
            logging.error(f"Failed to load Whisper model '{model_name}': {e}")
            raise RuntimeError(f"Could not initialize Whisper model: {e}")

    def transcribe_audio(self, audio_file: str, language: str = None) -> str:
        """
        Transcribe an audio file using the Whisper model.
        Args:
            audio_file (str): Path to the audio file to transcribe.
            language (str): Optional ISO 639-1 language code for transcription.
        Returns:
            str: Transcribed text.
        """
        if not os.path.exists(audio_file):
            raise FileNotFoundError(f"Audio file not found: {audio_file}")
        if not os.access(audio_file, os.R_OK):
            raise PermissionError(f"Audio file cannot be read: {audio_file}")
        
        # Perform the transcription
        try:
            result = self.model.transcribe(audio_file, language=language)
            return result["text"]
        except Exception as e:
            logging.error(f"Failed to transcribe file '{audio_file}': {e}")
            raise RuntimeError(f"Transcription failed: {e}")

# Example usage
if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    # Initialize the transcriber with the "base" model
    transcriber = WhisperTranscriber()

    # Path to your audio file
    audio_file = "output.mp3"

    try:
        # Transcribe the audio
        transcribed_text = transcriber.transcribe_audio(audio_file)
        print("Transcribed text:")
        print(transcribed_text)
    except FileNotFoundError as e:
        logging.error(f"Error: {e}")
    except PermissionError as e:
        logging.error(f"Error: {e}")
    except Exception as e:
        logging.error(f"An error occurred: {e}")
