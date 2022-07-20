import useImage from "use-image";
import { Image, Transformer } from "react-konva";
import { useRef, useEffect } from "react";
import { FILTERS, CANVAS_SIZE } from "../../utils";
import Konva from "konva";

const URLMainImage = ({ image, isSelected, filter, onClick, onChange }) => {
  const trRef = useRef();
  const imageRef = useRef();
  const [img] = useImage(image.src, "anonymous");

  useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([imageRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  useEffect(() => {
    if (img) {
      imageRef.current.cache();
    }
  }, [img]);

  return (
    <>
      {img ? (
        <>
          <Image
            className="sepia"
            ref={imageRef}
            onClick={onClick}
            image={img}
            width={img ? img.width : 0}
            height={img ? img.height : 0}
            x={!img.width ? image?.x : (CANVAS_SIZE.x - img.width) / 2}
            y={!img.height ? image?.y : (CANVAS_SIZE.y - img.height) / 2}
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

export default URLMainImage;
