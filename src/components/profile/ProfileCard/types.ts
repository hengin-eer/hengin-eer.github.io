interface SnsProfileBase {
  label: string;
  href: string;
  primaryColor: string;
}

type SnsProfile = SnsProfileBase &
  (
    | { iconName: string; iconSvg?: never }
    | { iconSvg: string; iconName?: never }
  );

export type { SnsProfile };
