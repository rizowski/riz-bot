export interface Field {
  value: string;
  name: string;
  inline?: boolean;
}

export interface Embed {
  title: string;
  color?: number;
  description?: string;
  fields?: Field[];
}

export interface Embedable {
  embed: Embed;
}
