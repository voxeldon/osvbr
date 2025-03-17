import { BlockComponentOnPlaceEvent, BlockCustomComponent } from "@minecraft/server";
import { PACK_ID } from "../global";

export class StairsComponent implements BlockCustomComponent {
    public static readonly id: string = `${PACK_ID}:stairs`;
    constructor() {
        this.onPlace = this.onPlace.bind(this);
    }

    public onPlace(event: BlockComponentOnPlaceEvent): void {
        event.block.setPermutation(event.block.permutation.withState('vxl:placed_bit', true));
    }
}
