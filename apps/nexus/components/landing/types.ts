export interface TagData {
  text: string;
  href: string;
}

export interface ProjectData {
  badges: TagData[];
  imgSrc: string;
  repoId: number;
  color: 'blue' | 'magenta' | 'green' | 'red' | 'yellow' | 'cyan' | 'default';
  reverse?: boolean;
}
