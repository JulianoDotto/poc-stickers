import useImage from "use-image";
import { Image, Transformer } from "react-konva";
import { useRef, useEffect } from "react";
import { FILTERS } from "../utils";
import Konva from "konva";

const URLSticker = ({ image, isSelected, filter, onClick, onChange }) => {
  const stickerRef = useRef();
  const trRef = useRef();
  const [img] = useImage(image.src, "anonymous");

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

  return (
    <>
      {img ? (
        <>
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
