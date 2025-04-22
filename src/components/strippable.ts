import { Block, Direction, ItemStack, Player, PlayerInteractWithBlockAfterEvent, system, world } from "@minecraft/server";

export class StrippableBlockComponent {
    private static initialized: boolean = false;
    public static registerGlobalComponent(): void {
        if (!StrippableBlockComponent.initialized) {
            world.beforeEvents.playerInteractWithBlock.subscribe((event: PlayerInteractWithBlockAfterEvent) => {
                if (!event.isFirstEvent || !event.player || !event.itemStack || !event.block.hasTag('osvbr_is_strippable')) return;
                const itemStack: ItemStack = event.itemStack;
                const run: number = system.run(() => {
                    StrippableBlockComponent.onPlayerInteract(event.player, event.block, itemStack);
                    system.clearRun(run);
                })
            })
        } else throw Error('Instance of StripHandler already active.')
    }

    private static onPlayerInteract(player: Player, block: Block, itemStack: ItemStack): void {
        if (!itemStack || (itemStack && !itemStack.hasTag('minecraft:is_axe'))) return;
        const split: string[] = block.typeId.split(':');
        const blockFace = block.permutation.getState('minecraft:block_face') as Direction;
        try { block.setType(`${split[0]}:stripped_${split[1]}`) }
        catch (error) { throw Error(`${error}`) };
        block.setPermutation(block.permutation.withState('minecraft:block_face', blockFace));
    }
}