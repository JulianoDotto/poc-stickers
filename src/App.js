import "./App.css";
import { Stage, Layer } from "react-konva";
import { useEffect, useRef, useState } from "react";
import URLSticker from "./components/URLSticker";
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

  function downloadURI(uri, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    link.crossOrigin = "anonymous";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const handleExport = () => {
    setSelectedId(null);
    setExportImage(true);
  };

  useEffect(() => {
    if (exportImage && selectedId === null) {
      const uri = stageRef.current.toDataURL();
      downloadURI(uri, "minha_foto.png");
      setExportImage(false);
    }
  }, [selectedId, exportImage]);

  const removeSelectedSticker = (deleteId) => {
    if (deleteId >= 0) {
      const newImages = images;
      newImages.splice(deleteId, 1);
      setImages(newImages);
    }
    setSelectedId(null);
  };

  const checkDragLimitis = (img) => {
    if (img.x > CANVAS_SIZE.x) img.x = CANVAS_SIZE.x;
    if (img.y > CANVAS_SIZE.y) img.y = CANVAS_SIZE.y;
    return img;
  };

  return (
    <div className="align-center">
      <input type="file" accept="image/*" onChange={onImageChange} />
      <div className="flex">
        {selectedFilter > 0 && (mainImage || !!images.length) && (
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
                  src: dragUrl.current,
                },
              ])
            );
          }}
          onDragOver={(e) => e.preventDefault()}
        >
          <Stage
            width={CANVAS_SIZE.x}
            height={CANVAS_SIZE.y}
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
                  <URLSticker
                    key={index}
                    isSelected={index === selectedId}
                    filter={selectedFilter}
                    onClick={() => setSelectedId(index)}
                    onDeleteSticker={() => removeSelectedSticker(index)}
                    onChange={(newAttrs) => {
                      const rects = images.slice();
                      rects[index] = checkDragLimitis(newAttrs);
                      setImages(rects);
                    }}
                    image={image}
                  />
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
      <div>
        {STICKERS.map((sticker) => (
          <img
            key={sticker.alt}
            alt={sticker.alt}
            src={sticker.src}
            draggable="true"
            onDragStart={(e) => {
              dragUrl.current = e.target.src;
            }}
          />
        ))}
      </div>
      <div>
        <button onClick={handleExport}>Exportar minha foto</button>
      </div>
    </div>
  );
}

export default App;
