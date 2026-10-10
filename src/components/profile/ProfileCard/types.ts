interface SnsProfileBase {
  label: string;
  href: string;
  primaryColor: string;
}

// Iconifyにあるアイコンは iconName、無いものはローカルSVG(?raw)を iconSvg で渡す
type SnsProfile = SnsProfileBase &
  (
    | { iconName: string; iconSvg?: never }
    | { iconSvg: string; iconName?: never }
  );

export type { SnsProfile };
