import useImage from "use-image";
import { Image, Transformer } from "react-konva";
import { useRef, useEffect, useMemo } from "react";
import "gifler";

const URLAnimatedSticker = ({ image, isSelected, onSelect }) => {
  const stickerRef = useRef();
  const trRef = useRef();
  const [img] = useImage(image.src);
  const canvas = useMemo(() => {
    const node = document.createElement("canvas");
    return node;
  }, []);

  useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([stickerRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  useEffect(() => {
    // save animation instance to stop it on unmount
    let anim;
    window.gifler(image.src).get((a) => {
      anim = a;
      anim.animateInCanvas(canvas);
      anim.onDrawFrame = (ctx, frame) => {
        ctx.drawImage(frame.buffer, frame.x, frame.y);
        stickerRef.current.getLayer().draw();
      };
    });
    return () => anim.stop();
  }, [image, canvas]);

  return (
    <>
      {canvas ? (
        <>
          <Image
            ref={stickerRef}
            onClick={onSelect}
            image={canvas}
            x={image.x}
            y={image.y}
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

export default URLAnimatedSticker;
