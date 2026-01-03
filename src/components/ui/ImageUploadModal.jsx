import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { getCroppedImg } from "@/utils/imageUtils";
import { Slider } from "@/components/ui/slider";
import { X, ZoomIn, ZoomOut } from "lucide-react";

const ImageUploadModal = ({
  imageSrc,
  onCancel,
  onCropComplete,
  uploading,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = (crop) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom) => {
    setZoom(zoom);
  };

  const onCropCompleteHandler = useCallback(
    (croppedArea, croppedAreaPixels) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleSave = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedImage);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-md rounded-xl shadow-2xl overflow-hidden border border-border flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h3 className="font-semibold text-lg">Crop Profile Picture</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            disabled={uploading}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="relative w-full h-80 bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteHandler}
            onZoomChange={onZoomChange}
            showGrid={true}
            cropShape="round"
          />
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <ZoomOut size={14} /> Zoom
              </span>
              <span className="flex items-center gap-1">
                <ZoomIn size={14} />
              </span>
            </div>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(e.target.value)}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onCancel} disabled={uploading}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={uploading}>
              {uploading ? "Uploading..." : "Save & Upload"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadModal;
