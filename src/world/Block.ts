import { MaterialType } from "@/world/MaterialType";

export interface BlockOptions {
  data?: number;
  materialType?: MaterialType;
}

export class Block {
  materialType: MaterialType;

  constructor(options: BlockOptions) {
    if (options.materialType) {
      this.materialType = options.materialType;
    } else {
      this.setData(options.data);
    }
  }

  getData(): number {
    return this.materialType << 0;
  }

  setData(data: number) {
    data >>= 0;
    this.materialType = data & ((1 << 3) - 1);
  }
}
