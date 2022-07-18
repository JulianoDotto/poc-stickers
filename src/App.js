import "./App.css";
import { Stage, Layer } from "react-konva";
import { useEffect, useRef, useState } from "react";
import URLSticker from "./components/URLSticker";
import URLMainImage from "./components/URLMainImage";
import { FILTERS, STICKERS } from "./utils";

const LAYER_SIZE = {
  x: 300,
  y: 500,
};

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

  const removeSelectedSticker = () => {
    if (!!selectedId && selectedId > -1) {
      const newImages = images;
      newImages.splice(selectedId, 1);
      setImages(newImages);
    } else {
    }
    setSelectedId(null);
  };

  const checkDragLimitis = (img) => {
    if (img.x > LAYER_SIZE.x) img.x = LAYER_SIZE.x;
    if (img.y > LAYER_SIZE.y) img.y = LAYER_SIZE.y;
    return img;
  };

  return (
    <>
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
            width={LAYER_SIZE.x}
            height={LAYER_SIZE.y}
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
      <div>
        {!!selectedId && (
          <button onClick={removeSelectedSticker}>deletar sticker</button>
        )}
        <button onClick={handleExport}>Exportar minha foto</button>
      </div>
    </>
  );
}

export default App;
