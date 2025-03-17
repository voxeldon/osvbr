import { Block, BlockComponentPlayerInteractEvent, BlockComponentRandomTickEvent, BlockCustomComponent, BlockRaycastHit, EntityEquippableComponent, EquipmentSlot, GameMode, ItemStack, Structure, world } from "@minecraft/server";
import { Inventory } from "../_lib/inventory";
import { Vector3 } from "../_lib/vector";
import { PACK_ID, STRUCTURE_PATH } from "../global";

export class SaplingComponent implements BlockCustomComponent {
    public static readonly id: string = `${PACK_ID}:sapling`;
    private readonly growth_bit: string = `${PACK_ID}:growth_bit`;
    private readonly particleId: string = 'minecraft:crop_growth_emitter';
    private readonly triggerTypeId: string = 'minecraft:bone_meal';
    constructor() {
        this.onRandomTick = this.onRandomTick.bind(this);
        this.onPlayerInteract = this.onPlayerInteract.bind(this);
    }

    public onRandomTick(event: BlockComponentRandomTickEvent): void {
        this.processGrowth(event.block, 9);
        
    }

    public onPlayerInteract(event: BlockComponentPlayerInteractEvent): void {
        if (!event.player) return; 
        const inventory = new Inventory(event.player);
        const i: EntityEquippableComponent = inventory.getEquippableComponent();
        const itemStack: ItemStack | undefined = i.getEquipment(EquipmentSlot.Mainhand);
        if (itemStack && itemStack.typeId === this.triggerTypeId) {    
            let updatedItemStack: ItemStack | undefined = undefined;
            if (event.player.getGameMode() === GameMode.creative) {
                updatedItemStack = itemStack;
            } else if (itemStack.amount > 1) {
                itemStack.amount--;
                updatedItemStack = itemStack;
            }
            this.processGrowth(event.block, 9);
            i.setEquipment(EquipmentSlot.Mainhand, updatedItemStack);
        }
        event.block.dimension.spawnParticle(this.particleId, Vector3.add(event.block, 0.5));
        
    }

    private processGrowth(block: Block, maxValue: number): void {
        let growth_bit = block.permutation.getState(this.growth_bit) as number;
        if (growth_bit < maxValue) {
            block.setPermutation(block.permutation.withState(this.growth_bit, growth_bit + 1));
            
        } else if (growth_bit === 9) {
            const structure: Structure | undefined = world.structureManager.get(STRUCTURE_PATH);
            if (!structure) throw Error(`finding structure ${STRUCTURE_PATH}`);
            //Check if tree strucrure is obstructed
            const raycastHit: BlockRaycastHit | undefined = block.dimension.getBlockFromRay(block, new Vector3(0, 1, 0), { maxDistance: structure.size.y -1 });
            if (raycastHit && !raycastHit.block.isAir && !block.hasTag('leaves')) {
                console.warn('Obstructed cant grow');
                return;
            }
            const location: Vector3 = new Vector3(
                block.x - Math.floor(structure.size.x / 2),
                block.y,
                block.z - Math.floor(structure.size.z / 2)
            );
            world.structureManager.place(structure, block.dimension, location)
        }
    }
}
