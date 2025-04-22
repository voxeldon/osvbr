import { BlockComponentOnPlaceEvent, BlockCustomComponent } from "@minecraft/server";
import { PACK_ID } from "../global";
import { BlockStateSuperset } from "@minecraft/vanilla-data";

export class StairsComponent implements BlockCustomComponent {
    public static readonly id: string = `${PACK_ID}:stairs`;
    constructor() {
        this.onPlace = this.onPlace.bind(this);
    }

    public onPlace(event: BlockComponentOnPlaceEvent): void {
        event.block.setPermutation(event.block.permutation.withState('osvbr:placed_bit' as keyof BlockStateSuperset, true));
    }
}
