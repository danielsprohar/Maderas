export class ItemRelocate {
  index: number;
  src: string;
  dest: string;

  /**
   *
   * @param src The ObjectId of the source List.
   * @param dest The ObjectId of the destination List.
   * @param index The index position in which the Item should be placed.
   */
  constructor(src: string, dest: string, index: number) {
    this.index = index;
    this.src = src;
    this.dest = dest;
  }
}
