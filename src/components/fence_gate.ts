import { BlockComponentOnPlaceEvent, BlockComponentPlayerInteractEvent, BlockCustomComponent } from "@minecraft/server";
import { PACK_ID } from "../global";
import { BlockStateSuperset } from "@minecraft/vanilla-data";

export class FenceGateComponent implements BlockCustomComponent {
    public static readonly id = `${PACK_ID}:fence_gate`;
    private readonly openBit = `${PACK_ID}:open_bit`as keyof BlockStateSuperset;
    private readonly cardinalDirection = `minecraft:cardinal_direction`;
    private readonly placedBit = `osvbr:placed_bit` as keyof BlockStateSuperset;
    constructor() {
        this.onPlace = this.onPlace.bind(this);
        this.onPlayerInteract = this.onPlayerInteract.bind(this);
    }

    public onPlace(event: BlockComponentOnPlaceEvent): void {
        const { block } = event;
        block.setPermutation(block.permutation.withState(this.placedBit, true));
    }

    public onPlayerInteract(event: BlockComponentPlayerInteractEvent): void {
        const { block, face } = event;
        const open_bit = block.permutation.getState(this.openBit);
        const cardinal_direction = block.permutation.getState(this.cardinalDirection);
        if (open_bit == false) {
            if (face == 'South' && (cardinal_direction == 'north' || cardinal_direction == 'south')) {
                block.setPermutation(block.permutation.withState(this.cardinalDirection, 'north'));
                block.setPermutation(block.permutation.withState(this.openBit, true));
            }
            if (face == 'North' && (cardinal_direction == 'north' || cardinal_direction == 'south')) {
                block.setPermutation(block.permutation.withState(this.cardinalDirection, 'south'));
                block.setPermutation(block.permutation.withState(this.openBit, true));
            }
            if (cardinal_direction == 'north' || cardinal_direction == 'south') {
                block.setPermutation(block.permutation.withState(this.openBit, true));
                block.dimension.playSound('open.fence_gate', block.location);
            }
            if (face == 'East' && (cardinal_direction == 'west' || cardinal_direction == 'east')) {
                block.setPermutation(block.permutation.withState(this.cardinalDirection, 'east'));
                block.setPermutation(block.permutation.withState(this.openBit, true));
            }
            if (face == 'West' && (cardinal_direction == 'west' || cardinal_direction == 'east')) {
                block.setPermutation(block.permutation.withState(this.cardinalDirection, 'west'));
                block.setPermutation(block.permutation.withState(this.openBit, true));
            }
            if (cardinal_direction == 'west' || cardinal_direction == 'east') {
                block.setPermutation(block.permutation.withState(this.openBit, true));
                block.dimension.playSound('open.fence_gate', block.location);
            }
        }
        if (open_bit == true) {
            if (face == 'South' && (cardinal_direction == 'north' || cardinal_direction == 'south')) {
                block.setPermutation(block.permutation.withState(this.cardinalDirection, 'north'));
                block.setPermutation(block.permutation.withState(this.openBit, false));
            }
            if (face == 'North' && (cardinal_direction == 'north' || cardinal_direction == 'south')) {
                block.setPermutation(block.permutation.withState(this.cardinalDirection, 'south'));
                block.setPermutation(block.permutation.withState(this.openBit, false));
            }
            if (cardinal_direction == 'north' || cardinal_direction == 'south') {
                block.setPermutation(block.permutation.withState(this.openBit, false));
                block.dimension.playSound('close.fence_gate', block.location);
            }
            if (face == 'East' && (cardinal_direction == 'west' || cardinal_direction == 'east')) {
                block.setPermutation(block.permutation.withState(this.cardinalDirection, 'east'));
                block.setPermutation(block.permutation.withState(this.openBit, false));
            }
            if (face == 'West' && (cardinal_direction == 'west' || cardinal_direction == 'east')) {
                block.setPermutation(block.permutation.withState(this.cardinalDirection, 'west'));
                block.setPermutation(block.permutation.withState(this.openBit, false));
            }
            if (cardinal_direction == 'west' || cardinal_direction == 'east') {
                block.setPermutation(block.permutation.withState(this.openBit, false));
                block.dimension.playSound('close.fence_gate', block.location);
            }
        }
    }
}
