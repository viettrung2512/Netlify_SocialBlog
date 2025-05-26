
import { useState } from "react";
import PropTypes from "prop-types";

const BlogAudio = ({ blogText }) => {
  const [audioUrl, setAudioUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false); 

  const generateAudio = async () => {
    setIsGenerating(true); 
    try {
      const response = await fetch("/api/audio/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: blogText }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      } else {
        console.error("Error generating audio");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsGenerating(false); 
    }
  };

  return (
    <div className="bg-white text-black p-4">
      {!audioUrl && !isGenerating && ( 
        <button
          onClick={generateAudio}
          className="bg-white text-black px-4 py-2 border border-white rounded hover:text-blue"
        >
          Convert to Audio
        </button>
      )}
      {isGenerating && ( 
        <p className="text-sm font-medium">Generating audio...</p>
      )}
      {audioUrl && ( 
        <audio controls>
          <source src={audioUrl} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};
BlogAudio.propTypes = {
  blogText: PropTypes.string.isRequired,
};

export default BlogAudio;
