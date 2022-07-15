import "./App.css";
import Konva from "konva";
import useImage from "use-image";
import { Image, Stage, Layer, Transformer } from "react-konva";
import { useRef, useState, useEffect } from "react";

const STICKERS = [
  {
    src: "https://cdn-icons-png.flaticon.com/128/863/863491.png",
    alt: "mustache",
  },
  {
    src: "https://konvajs.org/assets/lion.png",
    alt: "lion",
  },
];

const FILTERS = [
  "",
  "Blur",
  "Brighten",
  "Contrast",
  "Emboss",
  "Enhance",
  "Grayscale",
  "HSL",
  "HSV",
  "Invert",
  "Kaleidoscope",
  "Mask",
  "Noise",
  "Pixelate",
  "Posterize",
  "RGB",
  "RGBA",
  "Sepia",
  "Solarize",
  "Threshold",
];

const URLSticker = ({ image, isSelected, onClick, onChange }) => {
  const stickerRef = useRef();
  const trRef = useRef();
  const [img] = useImage(image.src);

  useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([stickerRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Image
        ref={stickerRef}
        onClick={onClick}
        image={img}
        x={image.x}
        y={image.y}
        offsetX={img ? img.width / 2 : 0}
        offsetY={img ? img.height / 2 : 0}
        draggable
        onDragEnd={(e) => {
          onChange({
            ...image,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

const URLMainImage = ({ image, filter }) => {
  const [img] = useImage(image.src, "anonymous");
  const imageRef = useRef();

  useEffect(() => {
    if (image) {
      imageRef.current.cache();
    }
  }, [image]);

  return (
    <Image
      ref={imageRef}
      image={img}
      x={image.x}
      y={image.y}
      filters={!!FILTERS[filter] ? [Konva.Filters[FILTERS[filter]]] : undefined}
    />
  );
};

function App() {
  const stageRef = useRef();
  const dragUrl = useRef();
  const [mainImage, setMainImage] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(0);

  const onImageChange = (e) => {
    setMainImage(e.target.files);
  };

  const renderMainImage = () => {
    return {
      x: 0,
      y: 0,
      src: URL.createObjectURL(mainImage[0]),
    };
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
    const uri = stageRef.current.toDataURL();
    downloadURI(uri, "minha_foto.png");
  };

  const removeSelectedSticker = () => {
    const newImages = images;
    newImages.splice(selectedId, 1);
    setImages(newImages);
    setSelectedId(null);
  };

  return (
    <>
      <input type="file" accept="image/*" onChange={onImageChange} />
      <div className="flex">
        {selectedFilter !== 0 && (
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
            width={300}
            height={500}
            onMouseDown={checkDeselect}
            onTouchStart={checkDeselect}
            style={{ border: "1px solid grey", width: "fit-content" }}
            ref={stageRef}
          >
            <Layer>
              {!!mainImage.length && (
                <URLMainImage
                  filter={selectedFilter}
                  image={renderMainImage()}
                />
              )}
              {images.map((image, index) => {
                return (
                  <URLSticker
                    key={index}
                    isSelected={index === selectedId}
                    onClick={() => setSelectedId(index)}
                    onChange={(newAttrs) => {
                      const rects = images.slice();
                      rects[index] = newAttrs;
                      setImages(rects);
                    }}
                    image={image}
                  />
                );
              })}
            </Layer>
          </Stage>
        </div>
        {selectedFilter < FILTERS.length - 1 && (
          <button onClick={() => setSelectedFilter((prev) => prev + 1)}>
            {">"}
          </button>
        )}
      </div>
      {STICKERS.map((sticker) => (
        <img
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
