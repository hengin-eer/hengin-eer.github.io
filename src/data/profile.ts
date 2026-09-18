export const profileDepthStops = [
  { id: "surface", label: "Surface", depth: "0m", progress: 0 },
  { id: "about", label: "Shallow", depth: "10m", progress: 0.22 },
  { id: "timeline", label: "Open water", depth: "50m", progress: 0.48 },
  { id: "values", label: "Deep", depth: "120m", progress: 0.72 },
  { id: "links", label: "Abyss", depth: "300m", progress: 1 },
] as const;

export const profileTimeline = [
  {
    stage: "入口",
    title: "ものづくりへの興味",
    description:
      "キャッチボールとサカナ、そして手を動かして何かをつくることを大切にしています。",
  },
  {
    stage: "制作",
    title: "Webとプログラミング",
    description:
      "Web制作とプログラミングを軸に、考えたことを形にするための技術を学んでいます。",
  },
  {
    stage: "現在",
    title: "学びながら、つくる",
    description:
      "読書、言語、認知学、コンピュータサイエンスなど、興味のある領域を行き来しながら制作を続けています。",
  },
] as const;

export const profileValues = [
  {
    title: "Curious",
    description: "知らないことを面白がり、まずは観察してみる。",
  },
  {
    title: "Make",
    description: "考えるだけで終わらせず、小さく形にして確かめる。",
  },
  {
    title: "Share",
    description: "つくった過程や学びを、次の対話につなげる。",
  },
] as const;

export const profileLinks = [
  { label: "GitHub", href: "https://github.com/hengin-eer/" },
  { label: "X", href: "https://x.com/timdaik" },
  { label: "Instagram", href: "https://instagram.com/timdaik" },
] as const;
