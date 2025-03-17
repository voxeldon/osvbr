import { Block, BlockComponentPlayerDestroyEvent, BlockCustomComponent, EnchantmentType, EnchantmentTypes, EquipmentSlot, ItemEnchantableComponent, ItemStack, Player } from "@minecraft/server";
import { Inventory } from "../_lib/inventory";
import { PACK_ID } from "../global";

export class ShearItemDestructible implements BlockCustomComponent {
    public static readonly id: string = `${PACK_ID}:is_shear_item_destructible`;
    private readonly triggerTypeId: string = 'minecraft:shears';
    constructor() {
        this.onPlayerDestroy = this.onPlayerDestroy.bind(this);
    }

    public onPlayerDestroy(event: BlockComponentPlayerDestroyEvent): void {
        if (!event.player) return;
        const itemStack: ItemStack | undefined = new Inventory(event.player).getEquippableComponent().getEquipment(EquipmentSlot.Mainhand);
        
        const spawnItem = ((player: Player)=>{
            const block: Block = event.block;
            block.setPermutation(event.destroyedBlockPermutation);
            player.dimension.spawnItem(new ItemStack(block.typeId), block.location);
            block.setType('minecraft:air');
        })
        
        if (itemStack && itemStack.typeId === this.triggerTypeId) {
            spawnItem(event.player);
        }
    }
    
}