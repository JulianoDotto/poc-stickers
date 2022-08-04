import useImage from "use-image";
import { Image, Transformer } from "react-konva";
import { useRef, useEffect } from "react";

const URLSticker = ({ image, isSelected, onSelect }) => {
  const stickerRef = useRef();
  const trRef = useRef();
  const [img] = useImage(image.src, "anonymous");

  useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([stickerRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      {img ? (
        <>
          <Image
            ref={stickerRef}
            image={img}
            x={image.x}
            y={image.y}
            onClick={onSelect}
            offsetX={img ? img.width / 2 : 0}
            offsetY={img ? img.height / 2 : 0}
          />
          {isSelected && (
            <Transformer
              resizeEnabled={false}
              rotateEnabled={false}
              ref={trRef}
              // boundBoxFunc={(oldBox, newBox) => {
              //   if (newBox.width < 5 || newBox.height < 5) {
              //     return oldBox;
              //   }
              //   return newBox;
              // }}
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
