export interface TagData {
  text: string;
  href: string;
}

export interface ProjectData {
  title: string;
  badges: TagData[];
  imgSrc: string;
  repo: string;
  color: 'blue' | 'magenta' | 'green' | 'red' | 'yellow' | 'cyan' | 'default';
  reverse?: boolean;
}
