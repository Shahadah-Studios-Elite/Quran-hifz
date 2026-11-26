export type DrawEvent =
  | {
      type: 'stroke';
      x0: number;
      y0: number;
      x1: number;
      y1: number;
      color: string;
      size: number;
    }
  | {
      type: 'text';
      x: number;
      y: number;
      text: string;
      color: string;
      size: number;
    }
  | {
      type: 'clear';
    };
