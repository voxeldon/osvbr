import {  BlockComponentTickEvent, BlockCustomComponent, Entity, world} from "@minecraft/server";
import { PACK_ID } from "../global";

export class PressurePlate implements BlockCustomComponent {
    public static readonly id: string = `${PACK_ID}:pressure_plate`;
    private readonly pressedBit: string = `${PACK_ID}:pressed_bit`;
    constructor() {
        this.onTick = this.onTick.bind(this);
    }

    public onTick(event: BlockComponentTickEvent): void {
        const entity: Entity | undefined = event.dimension.getEntities({location: event.block.location, maxDistance: 1, minDistance: 0})[0];
        const pressed = event.block.permutation.getState(this.pressedBit) as boolean;
        if (!pressed && entity) {
            world.playSound('click_on.wooden_pressure_plate', event.block);
            event.block.setPermutation(event.block.permutation.withState(this.pressedBit, true));
        }
        if (pressed && !entity) {
            world.playSound('click_off.wooden_pressure_plate', event.block);
            event.block.setPermutation(event.block.permutation.withState(this.pressedBit, false));
        }
    }
}