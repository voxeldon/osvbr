import { Block, BlockComponentPlayerPlaceBeforeEvent, BlockCustomComponent, BlockPermutation } from "@minecraft/server";
import { PACK_ID } from "../global";
import { BlockStateSuperset } from "@minecraft/vanilla-data";

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
            blockBelow.setPermutation(blockBelow.permutation.withState('osvbr:full_bit' as keyof BlockStateSuperset, true));
        }
    }
}