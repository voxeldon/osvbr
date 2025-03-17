import {  Block, BlockComponentTickEvent, BlockCustomComponent, PlayerPlaceBlockAfterEvent, world} from "@minecraft/server";
import { Vector3 } from "../_lib/vector";
import { GLOBAL_BLOCK_TAG, PACK_ID } from "../global";

export class Leaf implements BlockCustomComponent {
    public static readonly id = `${PACK_ID}:leaf`;
    public static decay: string = `${PACK_ID}:decay`;
    constructor() {
        this.onTick = this.onTick.bind(this);
    }

    public onTick(event: BlockComponentTickEvent): void {
        if (event.block.permutation.getState(Leaf.decay) === false){
            return;
        }
        if (!this.hasNeighbor(event.block)) {
            event.dimension.runCommand(`setblock ${event.block.x} ${event.block.y} ${event.block.z} air destroy`)
        }
    }

    private hasNeighbor(block: Block): boolean {
        const directions = [block.above, block.below, block.north, block.south, block.east, block.west];
        return directions.some(direction => {
            const neighbor = direction.call(block);
            let woodCheck: boolean = false;
            if (neighbor && neighbor.hasTag('wood')) {
                woodCheck = true;
            } else if (neighbor && neighbor.typeId === block.typeId) {
                const dimension = block.dimension;
                const blockPos = block.location;
                for (let x = -3; x <= 3; x++) {
                    for (let y = -3; y <= 3; y++) {
                        for (let z = -3; z <= 3; z++) {
                            const checkPos = new Vector3(blockPos.x + x, blockPos.y + y, blockPos.z + z);
                            const checkBlock = dimension.getBlock(checkPos);
                            if (checkBlock && checkBlock.hasTag('wood')) {
                                woodCheck = true;
                                break;
                            }
                        }
                        if (woodCheck) break;
                    }
                    if (woodCheck) break;
                }
            }
            return neighbor && !neighbor.isAir && !neighbor.isLiquid && woodCheck;
        });
    }
}

world.afterEvents.playerPlaceBlock.subscribe((event: PlayerPlaceBlockAfterEvent)=>{
    if (event.block.hasTag(GLOBAL_BLOCK_TAG) && event.block.hasTag('leaves')) {
        event.block.setPermutation(event.block.permutation.withState(Leaf.decay, false));
    }
})