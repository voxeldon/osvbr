import { BlockComponentOnPlaceEvent, BlockComponentPlayerInteractEvent, BlockCustomComponent, world } from "@minecraft/server";
import { PACK_ID, SoundDefinition } from "../global";
import { BlockStateSuperset } from "@minecraft/vanilla-data";

export class TrapdoorComponent implements BlockCustomComponent {
    public static readonly id: string = `${PACK_ID}:trapdoor`;
    private readonly openBit = `${PACK_ID}:open_bit` as keyof BlockStateSuperset;
    private readonly placedBit = `${PACK_ID}:placed_bit` as keyof BlockStateSuperset;
    constructor() {
        this.onPlace = this.onPlace.bind(this);
        this.onPlayerInteract = this.onPlayerInteract.bind(this);
    }

    public onPlace(event: BlockComponentOnPlaceEvent): void {
        const { block } = event;
        block.setPermutation(block.permutation.withState(this.placedBit, true));

    }
    public onPlayerInteract(event: BlockComponentPlayerInteractEvent): void {
        const { block } = event;
        const openBit = block.permutation.getState(this.openBit) as boolean;
        let soundId: SoundDefinition = SoundDefinition.TrapdoorOpen
        if (openBit) soundId = SoundDefinition.TrapdoorClose
        block.setPermutation(block.permutation.withState(this.openBit, !openBit));
        world.playSound(soundId, block.location);
    }
}