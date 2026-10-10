import atcoderIcon from "../../../assets/icons/sns/atcoder.svg?raw";
import connpassIcon from "../../../assets/icons/sns/connpass.svg?raw";
import type { SnsProfile } from "./types";

const baseProfile = {
  name: "Hiroki Tomoda",
  handleName: "@timdaik",
  bio: `
  キャッチボールとサカナとマークアップをこよなく愛する学生です！
  最近はNUTMEGと温泉にハマっています。
  `,
};

const affilicationList = [
  {
    position: "IMSE B3",
    iconName: "ri:school-line",
    name: "NUT (Nagaoka University of Technology)",
    href: "https://imse.nagaokaut.ac.jp/",
  },
  {
    position: "46th副局長",
    iconName: "ri:community-line",
    name: "NUTMEG (NUTfes Modern Engineering Group)",
    href: "https://blog.nutmeg.cloud/",
  },
];

const snsProfileList: Array<SnsProfile> = [
  {
    label: "X",
    href: "https://x.com/timdaik",
    iconName: "ri:twitter-x-line",
    primaryColor: "#000000",
  },
  {
    label: "GitHub",
    href: "https://github.com/hengin-eer/",
    iconName: "ri:github-line",
    primaryColor: "#181717",
  },
  {
    label: "Instagram",
    href: "https://instagram.com/timdaik",
    iconName: "ri:instagram-line",
    primaryColor: "#E4405F",
  },
  {
    label: "Facebook",
    href: "https://facebook.com/timdaik",
    iconName: "ri:facebook-circle-line",
    primaryColor: "#0866FF",
  },
  {
    label: "Zenn",
    href: "https://zenn.dev/tim_daik",
    iconName: "simple-icons:zenn",
    primaryColor: "#3EA8FF",
  },
  {
    label: "connpass",
    href: "https://connpass.com/user/hengin-eer/",
    iconSvg: connpassIcon,
    primaryColor: "#D8141E",
  },
  {
    label: "AtCoder",
    href: "https://atcoder.jp/users/timdaik",
    iconSvg: atcoderIcon,
    primaryColor: "#222222",
  },
  {
    label: "Speaker Deck",
    href: "https://speakerdeck.com/timdaik",
    iconName: "simple-icons:speakerdeck",
    primaryColor: "#009287",
  },
];

export { baseProfile, affilicationList, snsProfileList };
