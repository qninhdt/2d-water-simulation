import { MaterialType, MaterialUtil } from "./world/MaterialType";

export class BlockMenu {
  dom: HTMLDivElement;
  selectingIndex: number;
  selectingMaterialType: MaterialType;
  menu: MaterialType[];

  constructor() {
    this.dom = document.getElementById("block-menu") as HTMLDivElement;
    this.menu = [
      MaterialType.GRASS,
      MaterialType.DIRT,
      MaterialType.WATER_8,
      MaterialType.WATER_7,
      MaterialType.WATER_6,
      MaterialType.WATER_5,
      MaterialType.WATER_4,
      MaterialType.WATER_3,
      MaterialType.WATER_2,
      MaterialType.WATER_1,
    ];
    this.build();
    this.selectIndex(0);
  }

  build() {
    let blockList = document.getElementById("block-list");

    this.menu
      .map((type) => MaterialUtil.getName(type))
      .forEach((name, i) => {
        let block = document.createElement("div");
        block.classList.add("block");

        let img = document.createElement("img");
        img.src = `${name}.png`;
        img.alt = name;

        block.appendChild(img);
        blockList.appendChild(block);

        block.addEventListener("click", (e) => {
          this.selectIndex(i);
        });
      });
  }

  selectIndex(index: number) {
    this.selectingIndex = index;
    this.selectingMaterialType = this.menu[this.selectingIndex];
    let old = document.getElementsByClassName("selecting-block");

    if (old[0]) old[0].classList.remove("selecting-block");
    document
      .getElementById("block-list")
      .children[index].classList.add("selecting-block");
  }
}
