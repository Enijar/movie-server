export type Torrent = {
  url: string;
  hash: string;
  quality: string;
  seeds: string;
  peers: string;
  size: string;
};

export type MovieData = {
  ytsId: number;
  title: string;
  year: number;
  rating: number;
  runtime: number;
  summary: string;
  coverImage: string;
  torrents: Torrent[];
};
