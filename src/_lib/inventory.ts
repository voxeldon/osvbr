import { Container, Entity, EntityEquippableComponent, EntityInventoryComponent, EquipmentSlot, ItemStack, Player } from "@minecraft/server";

export class Inventory {
    private source: Player | Entity;
    public container: Container;
    
    constructor(source: Player | Entity) {
        this.source = source;
        let inventory = source.getComponent(EntityInventoryComponent.componentId) as EntityInventoryComponent;
        if (inventory.container) this.container = inventory.container;
        else throw Error('container is undefined');
    }

    public getEquippableComponent(): EntityEquippableComponent {
        const equippable = this.source.getComponent(EntityEquippableComponent.componentId) as EntityEquippableComponent;
        if (equippable) return equippable;
        else throw Error('reading equippable component');
    }
}