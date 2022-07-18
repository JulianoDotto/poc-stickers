import Konva from "konva";
import useImage from "use-image";
import { Image, Transformer } from "react-konva";
import { useRef, useLayoutEffect } from "react";
import { FILTERS } from "./utils";

const URLMainImage = ({ image, isSelected, filter, onClick, onChange }) => {
  const trRef = useRef();
  const imageRef = useRef();
  const [img] = useImage(image.src, "anonymous");

  useLayoutEffect(() => {
    if (image) {
      imageRef.current.cache();
    }
  }, [image]);

  return (
    <>
      <Image
        ref={imageRef}
        image={img}
        x={image.x}
        y={image.y}
        filters={
          !!FILTERS[filter] ? [Konva.Filters[FILTERS[filter]]] : undefined
        }
        onClick={onClick}
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

export default URLMainImage;
