import { useState } from "react";
import { useRefContext } from "../../context/Ref";

type PromptBoxProps = {
    onSubmit: (inputValue: string) => void;
    onVoiceInput: (f: FormData) => void;
    isLoading: boolean;
};

function PromptBox({ onSubmit, onVoiceInput, isLoading }: PromptBoxProps) {
    const [inputValue, setInputValue] = useState("");
    const { inputRef } = useRefContext();
    const [isRecording, setIsRecording] = useState(false);
    const [audioLevel, setAudioLevel] = useState(0); // For audio detection

    const handleVoiceInput = () => {
        const SpeechRecognition =
            (window as any).SpeechRecognition ||
            (window as any).webkitSpeechRecognition;

        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.lang = "en-US"; // Set language
            recognition.interimResults = false;

            recognition.start();

            recognition.onstart = () => {
                console.log("Voice recording started...");
                setIsRecording(true);
            };

            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                console.log("Recognized text:", transcript);
                setInputValue((prev) => prev + transcript);
            };

            recognition.onerror = (event: any) => {
                console.error("Speech recognition error:", event.error);
            };

            recognition.onend = () => {
                console.log("Voice recording stopped.");
                setIsRecording(false);
            };
        } else {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                alert("Your browser does not support audio recording.");
                return;
            }

            navigator.mediaDevices
                .getUserMedia({ audio: true })
                .then((stream) => {
                    const audioContext = new AudioContext();
                    const mediaStreamSource = audioContext.createMediaStreamSource(stream);
                    const analyser = audioContext.createAnalyser();
                    mediaStreamSource.connect(analyser);

                    const mediaRecorder = new MediaRecorder(stream);
                    const audioChunks: Blob[] = [];
                    const dataArray = new Uint8Array(analyser.fftSize);

                    mediaRecorder.start();
                    setIsRecording(true);

                    const updateAudioLevel = () => {
                        analyser.getByteFrequencyData(dataArray);
                        const maxLevel = Math.max(...dataArray);
                        setAudioLevel(maxLevel);
                        if (isRecording) requestAnimationFrame(updateAudioLevel);
                    };
                    updateAudioLevel();

                    mediaRecorder.ondataavailable = (event) => {
                        audioChunks.push(event.data);
                    };

                    mediaRecorder.onstop = async () => {
                        setIsRecording(false);
                        setAudioLevel(0);
                        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
                        const formData = new FormData();
                        formData.append("audio", audioBlob);
                        onVoiceInput(formData);
                    };

                    setTimeout(() => {
                        mediaRecorder.stop();
                        stream.getTracks().forEach((track) => track.stop());
                    }, 5000); // Automatically stop recording after 5 seconds
                })
                .catch((error) => {
                    console.error("Error accessing microphone:", error);
                });
        }
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (!inputValue.trim()) return;
        onSubmit(inputValue);
        setInputValue("");
    };

    return (
        <form
            className="flex rounded-md border bg-white shadow-sm w-full items-center"
            onSubmit={handleSubmit}
        >
            <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-[8] rounded-md border py-2.5 px-4 sm:text-sm"
                placeholder="Type your message..."
            />
            <button
                disabled={isLoading}
                onClick={handleSubmit}
                className="flex-[1] border-e px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative"
            >
                Submit
            </button>
            <button
                className={`flex-[1] px-4 py-2 text-gray-700 focus:relative ${isRecording ? "bg-red-200" : ""
                    }`}
                title="Speak"
                onClick={handleVoiceInput}
                disabled={isRecording}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-5 w-5 mx-auto"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 1.5a3.75 3.75 0 00-3.75 3.75v6a3.75 3.75 0 007.5 0v-6A3.75 3.75 0 0012 1.5zm-6 9a.75.75 0 00-1.5 0v1.5a7.5 7.5 0 0015 0V10.5a.75.75 0 00-1.5 0v1.5a6 6 0 01-12 0V10.5zM12 15a.75.75 0 00-.75.75v3a.75.75 0 001.5 0v-3A.75.75 0 0012 15z"
                    />
                </svg>
            </button>
            {isRecording && (
                <div className="flex items-center gap-2 px-4 py-2 text-sm text-red-600">
                    <span>Recording...</span>
                    <div
                        className="h-2 w-2 rounded-full bg-red-600 animate-ping"
                        style={{ opacity: audioLevel / 255 }}
                    ></div>
                </div>
            )}
        </form>
    );
}

export default PromptBox;
