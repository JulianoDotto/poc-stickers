import useImage from "use-image";
import { Image, Transformer } from "react-konva";
import { useRef, useEffect } from "react";
import { FILTERS } from "../../utils";
import Konva from "konva";
import { Html } from "react-konva-utils";
import { useState } from "react";
const URLSticker = ({
  image,
  isSelected,
  filter,
  onClick,
  onChange,
  onDeleteSticker,
}) => {
  const stickerRef = useRef();
  const trRef = useRef();
  const [img] = useImage(image.src, "anonymous");
  const [closeBtnPosition, setCloseBtnPosition] = useState({
    x: image.x,
    y: image.y,
  });

  useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([stickerRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  useEffect(() => {
    if (img) {
      stickerRef.current.cache();
    }
  }, [img]);

  useEffect(() => {
    if ((image, img)) {
      const { x, y } = image;
      setCloseBtnPosition({ x: x + img.width / 2, y: y - img.height / 2 });
    }
  }, [image, img]);

  return (
    <>
      {img ? (
        <>
          {isSelected && (
            <Html>
              <p
                onClick={onDeleteSticker}
                style={{
                  position: "absolute",
                  top: closeBtnPosition.y,
                  left: closeBtnPosition.x,
                  color: "#ff0000",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                x
              </p>
            </Html>
          )}
          <Image
            ref={stickerRef}
            onClick={onClick}
            image={img}
            x={image.x}
            y={image.y}
            offsetX={img ? img.width / 2 : 0}
            offsetY={img ? img.height / 2 : 0}
            filters={!!filter ? [Konva.Filters[FILTERS[filter]]] : []}
            draggable
            onDragMove={(e) => {
              setCloseBtnPosition({
                x: e.target.x() + e.target.width() / 2,
                y: e.target.y() - e.target.height() / 2,
              });
            }}
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
      ) : (
        <></>
      )}
    </>
  );
};

export default URLSticker;
