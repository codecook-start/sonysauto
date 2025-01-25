/* eslint-disable @next/next/no-img-element */
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import React, { useState } from "react";
import { Carousel } from "react-responsive-carousel"; // Import Carousel
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import styles for the carousel
import { Maximize, Minimize, Pause, Play, X, ZoomIn } from "lucide-react";

type Image = string;

type LightboxProps = {
  images: Image[];
  visible: boolean;
  onClose: () => void;
};

const Lightbox: React.FC<LightboxProps> = ({ images, visible, onClose }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <Dialog open={visible} onOpenChange={onClose}>
      <DialogContent
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="h-screen max-h-[100vh] w-screen max-w-[100vw] items-center justify-center rounded-none border-none bg-black/10"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative flex h-full w-full flex-col items-center justify-center"
        >
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
            <div className="embla__button">
              <button
                onClick={toggleFullScreen}
                className="absolute left-4 top-4 z-50 rounded-full bg-white p-2"
              >
                {isFullScreen ? <Minimize size={24} /> : <Maximize size={24} />}
              </button>
              {/* Play/Pause Button */}
              <button
                onClick={togglePlayPause}
                className="absolute left-16 top-4 z-50 rounded-full bg-white p-2"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
              {/* Zoom Button */}
              <button
                onClick={toggleZoom}
                className="absolute left-28 top-4 z-50 rounded-full bg-white p-2"
              >
                <ZoomIn size={24} />
              </button>
            </div>
            {/* thumbnail */}
            <div className="relative flex h-full w-full max-w-full items-center justify-center">
              <Carousel
                selectedItem={selectedIndex}
                onChange={setSelectedIndex}
                infiniteLoop
                showThumbs={false}
                autoPlay={isPlaying}
                stopOnHover={false}
                emulateTouch
                dynamicHeight={false}
                showArrows={true}
                className="mx-auto max-h-[80vh] w-full max-w-[80vw]"
              >
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="flex h-full w-full items-center justify-center"
                  >
                    <img
                      src={`${window.location.origin}/${image}`} // Dynamically use the image URL passed in props
                      alt={`Image ${index + 1}`}
                      className={`w-full object-contain transition-transform duration-300 ${
                        isZoomed ? "scale-150" : "scale-200"
                      }`}
                      style={{ maxHeight: "80vh", maxWidth: "100%" }}
                      // className="h-full w-full object-cover"
                      loading="lazy"
                      fetchPriority="low"
                    />
                  </div>
                ))}
              </Carousel>
            </div>
          </div>
        </div>
        <DialogClose className="absolute right-4 top-4 rounded-full bg-white/75 p-2 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default Lightbox;
