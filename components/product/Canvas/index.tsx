import { FC, useEffect, useRef, useState } from 'react';

type CanvasProps = {
  canvasRef: any,
  imageUrl: string;
  width: number;
  height: number;
  text?: string;
  textColor: string;
//   textPosition: { x: number; y: number };
  fontFamily: string;
  fontSize: number;
  specialFontFamily: any;
  isSymbol: any;
};

const drawScaledImage = (
  image: HTMLImageElement,
  ctx: CanvasRenderingContext2D,
) => {
  const { width, height } = image;
  const aspectRatio = height / width;
  const scaledHeight = width * aspectRatio;

  ctx.clearRect(0, 0, width, scaledHeight);
  ctx.drawImage(image, 0, 0, width, width * aspectRatio);
};

const drawText = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  scaleFactor: number,
  text: string,
  textColor: string,
//   textPosition: { x: number; y: number },
  fontFamily: string,
  fontSize: number,
  specialFontFamily: string,
  isSymbol: any,
) => {
  const scaledFontSize = Math.round(fontSize * scaleFactor);
  ctx.font = `${scaledFontSize}px ${fontFamily}`;
  ctx.font = `${scaledFontSize}px ${specialFontFamily}`;
  ctx.fillStyle = textColor;
  ctx.fillText(
    text,
    10,
    10
    // Math.round((textPosition.x / 100) * canvas.width),
    // Math.round((textPosition.y / 100) * canvas.height),
  );
};

// const drawSpText = (
//   canvas: HTMLCanvasElement,
//   ctx: CanvasRenderingContext2D,
//   scaleFactor: number,
//   text: string,
//   textColor: string,
//   textPosition: { x: number; y: number },
//   fontFamily: string,
//   fontSize: number,
//   specialFontFamily: string,
//   isSymbol: any,
// ) => {
//   const scaledFontSize = Math.round(fontSize * scaleFactor);
//   ctx.font = ctx.font = `${scaledFontSize}px ${specialFontFamily}`;
//   ctx.fillStyle = textColor;
//   ctx.fillText(
//     text,
//     Math.round((textPosition.x / 100) * canvas.width),
//     Math.round((textPosition.y / 100) * canvas.height),
//   );
// };

const drawCanvas = (
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  width: number,
  text: string,
  textColor: string,
//   textPosition: { x: number; y: number },
  fontFamily: string,
  fontSize: number,
  specialFontFamily: any,
  isSymbol: any,
) => {
  if (!canvas || !image) {
    return;
  }

  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return;
  }

  ctx.clearRect(0, 0, image.width, image.height);

  const scaleFactor = image.width / width;

  drawScaledImage(image, ctx);
    drawText(
      canvas,
      ctx,
      scaleFactor,
      text,
      textColor,
    //   textPosition,
      fontFamily,
      fontSize,
      specialFontFamily,
      isSymbol,
    )
};

export const Canvas: FC<CanvasProps> = ({
  canvasRef,
  imageUrl,
  width,
  height,
  text = '',
  textColor,
//   textPosition,
  fontFamily,
  fontSize,
  specialFontFamily,
  isSymbol,
}: CanvasProps) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement>();

  // Load the image.
  useEffect(() => {
    if (imageUrl) {
      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        setImage(img);
      };

      img.src = imageUrl;
    }
  }, [imageUrl]);

  // Draw the canvas.
  useEffect(() => {
    const { current: canvas } = canvasRef;

    if (!canvas || !image) {
      return;
    }

    drawCanvas(
      canvas,
      image,
      width,
      text,
      textColor,
    //   textPosition,
      fontFamily,
      fontSize,
      specialFontFamily,
      isSymbol,
    );
  }, [image, width, text, textColor, fontFamily, fontSize]);

  if (!image) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      width={image.width}
      height={image.height}
      style={{ width, height }}
    />
  );
};
