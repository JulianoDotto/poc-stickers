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
  // {
  //   src: Sticker3,
  //   alt: "3",
  //   animated: true,
  // },
  // {
  //   src: Sticker3WEBP,
  //   alt: "3webp",
  // },
  {
    src: Sticker4,
    alt: "4",
    animated: true,
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
  },
  en: {
    chooseImage: "Choose an image",
    exportFile: "Export file",
    portuguese: "Portuguese",
    english: "English",
  },
};
