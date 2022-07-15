import "./App.css";
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

const URLSticker = ({ image, isSelected, onClick, onChange }) => {
  const stickerRef = useRef();
  const trRef = useRef();
  const [img] = useImage(image.src);

  useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
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
        // onTransformEnd={(e) => {
        //   const node = stickerRef.current;
        //   const scaleX = node.scaleX();
        //   const scaleY = node.scaleY();
        //   node.scaleX(1);
        //   node.scaleY(1);
        //   onChange({
        //     ...stickerRef,
        //     x: node.x(),
        //     y: node.y(),
        //     width: Math.max(5, node.width() * scaleX),
        //     height: Math.max(node.height() * scaleY),
        //   });
        // }}
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

const URLMainImage = ({ image }) => {
  const [img] = useImage(image.src);
  return <Image image={img} x={image.x} y={image.y} />;
};

function App() {
  const stageRef = useRef();
  const dragUrl = useRef();
  const [mainImage, setMainImage] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const onImageChange = (e) => {
    setMainImage(e.target.files);
  };

  const generateImageURL = (image) => {
    return URL.createObjectURL(image[0]);
  };

  const renderMainImage = () => {
    return {
      x: 0,
      y: 0,
      src: generateImageURL(mainImage),
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
    const uri = stageRef.current.toDataURL();
    console.log(uri);
    // we also can save uri as file
    // but in the demo on Konva website it will not work
    // because of iframe restrictions
    // but feel free to use it in your apps:
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
            {!!mainImage.length && <URLMainImage image={renderMainImage()} />}
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
