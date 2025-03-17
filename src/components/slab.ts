import { Block, BlockComponentPlayerPlaceBeforeEvent, BlockCustomComponent, BlockPermutation} from "@minecraft/server";
import { PACK_ID } from "../global";

export class SlabComponent implements BlockCustomComponent {
    public static readonly id: string = `${PACK_ID}:slab`;
    constructor() {
        this.beforeOnPlayerPlace = this.beforeOnPlayerPlace.bind(this);
    }
    public beforeOnPlayerPlace(event: BlockComponentPlayerPlaceBeforeEvent): void {
        const blockBelow: Block | undefined = event.block.below(); if (!blockBelow) return;
        const newBlock: Block = event.block; newBlock.setPermutation(event.permutationToPlace);
        if (newBlock.typeId === blockBelow.typeId) {
            if (blockBelow.permutation.getState('minecraft:vertical_half') !== 'bottom') return;
            event.permutationToPlace = BlockPermutation.resolve('minecraft:air');
            blockBelow.setPermutation(blockBelow.permutation.withState('vxl:full_bit', true));
        }
    }
}