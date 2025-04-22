import {  Block, BlockComponentTickEvent, BlockCustomComponent, PlayerPlaceBlockAfterEvent, world} from "@minecraft/server";
import { Vector3 } from "../_lib/vector";
import { GLOBAL_BLOCK_TAG, PACK_ID } from "../global";
import { BlockStateSuperset } from "@minecraft/vanilla-data";
import { Common } from "./common";

export class Leaf implements BlockCustomComponent {
    public static readonly id = `${PACK_ID}:leaf`;
    public static decay = `${PACK_ID}:decay` as keyof BlockStateSuperset;
    constructor() {
        this.onTick = this.onTick.bind(this);
    }

    public onTick(event: BlockComponentTickEvent): void {
        if (event.block.permutation.getState(Leaf.decay) === false){
            return;
        }
        const hasNeighbor = this.hasNeighbor(event.block);
        console.warn(hasNeighbor)
        if (!hasNeighbor) {
            event.block.setType('minecraft:air');
        }
    }

    private hasNeighbor(block: Block): boolean {
        const i = Common.getNeighborIterator(Common.getBlockNeighbors(block));
        return i.length > 0;
    }
}

world.afterEvents.playerPlaceBlock.subscribe((event: PlayerPlaceBlockAfterEvent)=>{
    if (event.block.hasTag(GLOBAL_BLOCK_TAG) && event.block.hasTag('leaves')) {
        event.block.setPermutation(event.block.permutation.withState(Leaf.decay, false));
    }
})