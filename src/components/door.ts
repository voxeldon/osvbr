import { Block, BlockComponentOnPlaceEvent, BlockComponentPlayerDestroyEvent, BlockComponentPlayerInteractEvent, BlockCustomComponent, BlockPermutation, world } from "@minecraft/server";
import { PACK_ID, SoundDefinition } from "../global";
import { BlockStateSuperset } from "@minecraft/vanilla-data";

export class DoorComponent implements BlockCustomComponent {
    public static readonly id = `${PACK_ID}:door`;
    private readonly upperBlockBit = `${PACK_ID}:upper_block_bit`as keyof BlockStateSuperset;
    private readonly openBit = `${PACK_ID}:open_bit`as keyof BlockStateSuperset;
    constructor() {
        this.onPlace = this.onPlace.bind(this);
        this.onPlayerInteract = this.onPlayerInteract.bind(this);
        this.onPlayerDestroy = this.onPlayerDestroy.bind(this);
    }

    public onPlace(event: BlockComponentOnPlaceEvent): void {
        const isUpperBlock = event.block.permutation.getState(this.upperBlockBit) as boolean;
        if (isUpperBlock === true) return;
        const aboveBlock: Block | undefined = event.block.above();
        if (!aboveBlock) return;
        let permutation: BlockPermutation = event.block.permutation;
        permutation = permutation.withState(this.upperBlockBit, true);
        aboveBlock.setPermutation(permutation);

    }
    public onPlayerInteract(event: BlockComponentPlayerInteractEvent): void {
        const isUpperBlock = event.block.permutation.getState(this.upperBlockBit) as boolean;
        let otherBlock: Block | undefined = undefined;
        if (isUpperBlock === true) otherBlock = event.block.below();
        else otherBlock = event.block.above();
        const openBit = event.block.permutation.getState(this.openBit) as boolean;
        let soundId: SoundDefinition = SoundDefinition.DoorOpen
        if (openBit) soundId = SoundDefinition.DoorClose
        event.block.setPermutation(event.block.permutation.withState(this.openBit, !openBit))
        if (otherBlock) otherBlock.setPermutation(otherBlock.permutation.withState(this.openBit, !openBit));
        world.playSound(soundId, event.block.location);
    }
    public onPlayerDestroy(event: BlockComponentPlayerDestroyEvent): void {
        const permutation: BlockPermutation = event.destroyedBlockPermutation;
        const isUpperBlock = permutation.getState(this.upperBlockBit) as boolean;
        let otherBlock: Block | undefined = undefined;
        if (isUpperBlock === true) otherBlock = event.block.below();
        else otherBlock = event.block.above();
        if (otherBlock) otherBlock.setType('minecraft:air');
    }
}
