import { useState } from "react";

function MediaCarousel({ images = [], videos = [] }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const mediaItems = [
        ...images.map((img) => ({ type: "image", src: img })),
        ...videos.map((vid) => ({ type: "video", src: vid })),
    ];

    if (mediaItems.length === 0) return null;

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
    };

    const currentMedia = mediaItems[currentIndex];

    return (
        <div className="mt-4 w-full sm:w-[500px] mx-auto flex flex-col items-center">
            <div className="w-full h-[300px] rounded overflow-hidden flex items-center justify-center">
                {currentMedia.type === "image" ? (
                    <img
                        src={currentMedia.src}
                        className="max-w-full max-h-full object-contain"
                    />
                ) : (
                    <video
                        controls
                        src={currentMedia.src}
                        className="max-w-full max-h-full object-contain"
                    />
                )}
            </div>

            {mediaItems.length > 1 && (
                <div className="flex justify-between w-full mt-2">
                    <button
                        onClick={handlePrev}
                        className="text-white bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
                    >
                        Previous
                    </button>
                    <div className="text-sm text-gray-400 self-center">
                        {currentIndex + 1} / {mediaItems.length}
                    </div>
                    <button
                        onClick={handleNext}
                        className="text-white bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

export default MediaCarousel;
