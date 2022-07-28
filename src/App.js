import "./App.css";
import { Stage, Layer } from "react-konva";
import { useEffect, useRef, useState } from "react";
import URLSticker from "./components/URLSticker";
import URLAnimatedSticker from "./components/URLAnimatedSticker";
import URLMainImage from "./components/URLMainImage";
import { FILTERS, STICKERS, CANVAS_SIZE } from "./utils";

function App() {
  const stageRef = useRef();
  const dragUrl = useRef();
  const [mainImage, setMainImage] = useState();
  const [images, setImages] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [exportImage, setExportImage] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(0);

  useEffect(() => {}, [stageRef]);

  const onImageChange = (e) => {
    if (e.target.files.length > 0)
      setMainImage({ x: 0, y: 0, src: URL.createObjectURL(e.target.files[0]) });
  };

  const checkDeselect = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
    }
  };

  function downloadURL(url, name, animated) {
    if (animated) {
      const vid = document.createElement("video");
      vid.src = url;
      vid.controls = true;
      document.body.appendChild(vid);
      const a = document.createElement("a");
      a.download = name;
      a.href = vid.src;
      a.crossOrigin = "anonymous";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      document.body.removeChild(vid);
    } else {
      var link = document.createElement("a");
      link.download = name;
      link.href = url;
      link.crossOrigin = "anonymous";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  const handleExport = () => {
    setSelectedId(null);
    setExportImage(true);
  };

  useEffect(() => {
    if (exportImage && selectedId === null) {
      const isAnimated = images.some((image) => image.animated);
      if (isAnimated) {
        var chunks = [];
        const canvas = document.querySelector(".konva-canvas canvas");
        const canvas_stream = canvas.captureStream();
        const mediaRecorder = new MediaRecorder(canvas_stream);

        mediaRecorder.ondataavailable = (e) => {
          chunks.push(e.data);
        };
        mediaRecorder.onstop = (e) => {
          const blob = new Blob(chunks, { type: "video/webm" });
          const url = URL.createObjectURL(blob);
          console.log(url);
          downloadURL(url, "meu_video.webm", true);
          setExportImage(false);
        };
        mediaRecorder.start(30);
        setTimeout(() => mediaRecorder.stop(), 3000);
      } else {
        const uri = stageRef.current.toDataURL();
        console.log(uri);
        downloadURL(uri, "minha_foto.png", false);
        setExportImage(false);
      }
    }
  }, [selectedId, exportImage, images]);

  const checkDragLimitis = (img) => {
    if (img.x > CANVAS_SIZE.x) img.x = CANVAS_SIZE.x;
    if (img.y > CANVAS_SIZE.y) img.y = CANVAS_SIZE.y;
    return img;
  };

  return (
    <div className="align-center">
      <input type="file" accept="image/*" onChange={onImageChange} />
      <div className="flex">
        {selectedFilter > 0 && mainImage && (
          <button onClick={() => setSelectedFilter((prev) => prev - 1)}>
            {"<"}
          </button>
        )}
        <div
          onDrop={(e) => {
            e.preventDefault();
            stageRef.current.setPointersPositions(e);
            setImages(
              images.concat([
                {
                  ...stageRef.current.getPointerPosition(),
                  src: dragUrl.current.src,
                  animated: dragUrl.current.animated,
                },
              ])
            );
          }}
          onDragOver={(e) => e.preventDefault()}
        >
          <Stage
            key="main"
            width={CANVAS_SIZE.x}
            height={CANVAS_SIZE.y}
            className="konva-canvas"
            onMouseDown={checkDeselect}
            onTouchStart={checkDeselect}
            style={{ border: "1px solid grey", width: "fit-content" }}
            ref={stageRef}
          >
            <Layer>
              {!!mainImage && (
                <URLMainImage
                  key={-1}
                  image={mainImage}
                  filter={selectedFilter}
                  onClick={() => setSelectedId(-1)}
                  isSelected={-1 === selectedId}
                  onChange={(newAttrs) => {
                    setMainImage(checkDragLimitis(newAttrs));
                  }}
                />
              )}
              {images.map((image, index) => {
                return (
                  <>
                    {image.animated ? (
                      <URLAnimatedSticker
                        key={index}
                        isSelected={index === selectedId}
                        image={image}
                      />
                    ) : (
                      <URLSticker
                        key={index}
                        isSelected={index === selectedId}
                        image={image}
                      />
                    )}
                  </>
                );
              })}
            </Layer>
          </Stage>
        </div>
        {selectedFilter < FILTERS.length - 1 &&
          (mainImage || !!images.length) && (
            <button onClick={() => setSelectedFilter((prev) => prev + 1)}>
              {">"}
            </button>
          )}
      </div>
      <div className="stickers-wrap">
        {STICKERS.map((sticker) => (
          <img
            key={sticker.alt}
            alt={sticker.alt}
            src={sticker.src}
            draggable
            onDragStart={(e) => {
              dragUrl.current = {
                src: e.target.src,
                animated: !!sticker.animated,
              };
            }}
          />
        ))}
      </div>
      <div>
        <button onClick={handleExport}>Exportar minha foto</button>
      </div>
      {/* {imagePreview && (
        <img width={64} height={64} src={imagePreview} alt="preview" />
      )} */}
    </div>
  );
}

export default App;
