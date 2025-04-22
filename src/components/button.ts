import { BlockComponentPlayerInteractEvent, BlockCustomComponent, system, TicksPerSecond, world} from "@minecraft/server";
import { PACK_ID } from "../global";
import { BlockStateSuperset } from "@minecraft/vanilla-data";

export class ButtonComponent implements BlockCustomComponent {
    public static readonly id = `${PACK_ID}:button`;
    private readonly pressedBit = `${PACK_ID}:button_pressed_bit` as keyof BlockStateSuperset;
    constructor() {
        this.onPlayerInteract = this.onPlayerInteract.bind(this);
    }

    public onPlayerInteract(event: BlockComponentPlayerInteractEvent): void {
        const pressed = event.block.permutation.getState(this.pressedBit) as boolean;
        if (pressed) return;
        world.playSound('click_on.bamboo_wood_button', event.block, {pitch: 2});
        event.block.setPermutation(event.block.permutation.withState(this.pressedBit, true));
        system.waitTicks(TicksPerSecond * 1.5).then(()=>{
            world.playSound('click_off.bamboo_wood_button', event.block);
            event.block.setPermutation(event.block.permutation.withState(this.pressedBit, false));
        })
    }
    
}