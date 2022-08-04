import Sticker1 from "./assets/sticker1.svg";
import Sticker2 from "./assets/sticker2.svg";
// import Sticker3 from "./assets/sticker3.gif";
// import Sticker3WEBP from "./assets/sticker3.webp";
import Sticker4 from "./assets/sticker4.gif";

export const FILTERS = ["", "Grayscale", "Sepia"];

export const STICKERS = [
  {
    src: Sticker1,
    alt: "1",
  },
  {
    src: Sticker2,
    alt: "2",
  },
  {
    src: Sticker4,
    alt: "4",
    animated: true,
  },
];

export const STICKER_TEMPLATES = [
  {
    name: "template 1",
    template: [
      { id: 1, x: 150, y: 100, src: Sticker4, animated: true },
      { id: 2, x: 150, y: 250, src: Sticker4, animated: true },
      { id: 3, x: 150, y: 400, src: Sticker2, animated: false },
    ],
  },
  {
    name: "template 2",
    template: [
      { id: 1, x: 150, y: 100, src: Sticker2, animated: false },
      { id: 2, x: 150, y: 250, src: Sticker2, animated: false },
      { id: 3, x: 150, y: 400, src: Sticker4, animated: true },
    ],
  },
];

export const CANVAS_SIZE = {
  x: 300,
  y: 500,
};

export const LANGUAGE_TEXTS = {
  ptBR: {
    chooseImage: "Escolha uma imagem",
    exportFile: "Exportar arquivo",
    portuguese: "Português",
    english: "Inglês",
    myImagePNG: "Minha_imagem.png",
    myVideoWEBM: "Meu_vídeo.webm",
    loading: "Carregando...",
  },
  en: {
    chooseImage: "Choose an image",
    exportFile: "Export file",
    portuguese: "Portuguese",
    english: "English",
    myImagePNG: "My_image.png",
    myVideoWEBM: "My_video.webm",
    loading: "Loading...",
  },
};
