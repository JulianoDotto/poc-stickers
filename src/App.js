import "./App.css";
import { Stage, Layer } from "react-konva";
import { useEffect, useRef, useState } from "react";
import URLSticker from "./components/URLSticker";
import URLAnimatedSticker from "./components/URLAnimatedSticker";
import URLMainImage from "./components/URLMainImage";
import {
  FILTERS,
  STICKERS,
  CANVAS_SIZE,
  LANGUAGE_TEXTS,
  STICKER_TEMPLATES,
} from "./utils";

function App() {
  const stageRef = useRef();
  const dragUrl = useRef();
  const [mainImage, setMainImage] = useState();
  const [images, setImages] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [exportImage, setExportImage] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(0);
  const [language, setLanguage] = useState("ptBR");
  const [loading, setLoading] = useState(false);

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
    setLoading(false);
  }

  const handleExport = () => {
    setSelectedId(null);
    setExportImage(true);
  };

  useEffect(() => {
    if (exportImage && selectedId === null) {
      setLoading(true);
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
          downloadURL(url, LANGUAGE_TEXTS[language].myVideoWEBM, true);
          setExportImage(false);
        };
        mediaRecorder.start(30);
        setTimeout(() => mediaRecorder.stop(), 3000);
      } else {
        const uri = stageRef.current.toDataURL();
        downloadURL(uri, LANGUAGE_TEXTS[language].myImagePNG, false);
        setExportImage(false);
      }
    }
  }, [selectedId, exportImage, images, language]);

  const changeTemplateSticker = (newSticker) => {
    const newImages = [...images];
    console.log(images);
    newImages.forEach((image) => {
      if (image.id === selectedId) {
        image.src = newSticker.src;
        image.animated = !!newSticker.animated;
        image.id = newSticker.id;
      }
    });
    console.log(images);
    console.log(newImages);
    setImages(newImages);
  };

  const changeStickerTemplate = (template) => {
    setImages(template);
  };

  const checkDragLimitis = (img) => {
    if (img.x > CANVAS_SIZE.x) img.x = CANVAS_SIZE.x;
    if (img.y > CANVAS_SIZE.y) img.y = CANVAS_SIZE.y;
    return img;
  };

  return (
    <div className="align-center">
      <div className="language-selector">
        <button
          className={language === "ptBR" ? "btn selected" : "btn"}
          onClick={() => setLanguage("ptBR")}
        >
          🇧🇷
        </button>
        <button
          className={language === "en" ? "btn selected" : "btn"}
          onClick={() => setLanguage("en")}
        >
          🇺🇸
        </button>
      </div>
      <div className="file-wrapper">
        <label className="btn" htmlFor="files">
          {LANGUAGE_TEXTS[language].chooseImage}
        </label>
        <input
          id="files"
          type="file"
          accept="image/*"
          onChange={onImageChange}
        />
      </div>
      <div className="flex">
        {selectedFilter > 0 && mainImage && (
          <button onClick={() => setSelectedFilter((prev) => prev - 1)}>
            {"<"}
          </button>
        )}
        <div
          // onDrop={(e) => {
          //   e.preventDefault();
          //   stageRef.current.setPointersPositions(e);
          //   setImages(
          //     images.concat([
          //       {
          //         ...stageRef.current.getPointerPosition(),
          //         src: dragUrl.current.src,
          //         animated: dragUrl.current.animated,
          //       },
          //     ])
          //   );
          // }}
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
              {images.map((image) => {
                return (
                  <>
                    {image.animated ? (
                      <URLAnimatedSticker
                        key={image.id}
                        isSelected={image.id === selectedId}
                        onSelect={() => setSelectedId(image.id)}
                        image={image}
                      />
                    ) : (
                      <URLSticker
                        key={image.id}
                        isSelected={image.id === selectedId}
                        onSelect={() => setSelectedId(image.id)}
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
        {selectedId >= 0 &&
          !!selectedId &&
          STICKERS.map((sticker) => (
            <img
              key={sticker.alt}
              alt={sticker.alt}
              src={sticker.src}
              onClick={() => changeTemplateSticker(sticker)}
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
      <div className="templateBtn-wrap">
        {STICKER_TEMPLATES.map(({ name, template }) => (
          <button
            className="btn"
            onClick={() => changeStickerTemplate(template)}
          >
            {name}
          </button>
        ))}
      </div>
      <div>
        {!loading ? (
          <button className="btn" onClick={handleExport}>
            {LANGUAGE_TEXTS[language].exportFile}
          </button>
        ) : (
          <span>{LANGUAGE_TEXTS[language].loading}</span>
        )}
      </div>
      {/* {imagePreview && (
        <img width={64} height={64} src={imagePreview} alt="preview" />
      )} */}
    </div>
  );
}

export default App;
