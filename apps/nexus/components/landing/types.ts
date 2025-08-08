export interface ProjectData {
  badges: TagData[];
  color: `blue` | `cyan` | `default` | `green` | `magenta` | `red` | `yellow`;
  imgSrc: string;
  repoId: number;
  reverse?: boolean;
}

export interface TagData {
  href: string;
  text: string;
}
