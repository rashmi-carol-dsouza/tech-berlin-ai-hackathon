import asyncio
import os
from typing import Optional
from lmnt.api import Speech

class LMNTtts:
    def __init__(self, api_key: Optional[str] = None, model: str = 'blizzard', voice_id: str = 'lily'):
        """
        Initialize the LMNT text-to-speech handler.
        Args:
            api_key (str): The LMNT API key. Defaults to the LMNT_API_KEY environment variable.
            voice_id (str): The ID of the voice to use for LMNT TTS.
            model (str): The model to use for synthesis.
        """
        self.api_key = api_key or os.environ.get('LMNT_API_KEY')
        self.voice_id = voice_id
        self.model = model
        self.output_file = 'output.mp3'

    async def synthesize(self, text: str):
        """
        Synthesize text using the LMNT API.
        Args:
            text (str): The text to synthesize.
        """
        async with Speech(self.api_key) as speech:
            synthesis = await speech.synthesize(text, voice='lily', format='mp3')
            # synthesis = await speech.synthesize(text, self.voice_id, model=self.model)
        
        with open(self.output_file, 'wb') as f:
            f.write(synthesis['audio'])
        print(f"Audio saved to {self.output_file}")

# Example usage
if __name__ == '__main__':
    async def main():
        # Initialize the TTS handler
        tts = LMNTtts()
        
        # Sample text to convert to speech
        sample_text = "In this area you should visit"
        
        # Synthesize the text
        await tts.synthesize(sample_text)

    # Run the async main function
    asyncio.run(main())