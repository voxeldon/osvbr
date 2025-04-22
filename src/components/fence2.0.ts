// Credits: Kaiōga
// Modified by: Donthedev
import { world, BlockPermutation, Block, BlockCustomComponent, BlockComponentPlayerPlaceBeforeEvent, system, BlockComponentOnPlaceEvent } from '@minecraft/server';
import { PACK_ID } from '../global';
import { BlockStateSuperset } from '@minecraft/vanilla-data';

const excludedTypes: string[] = [
    'minecraft:air',
    'minecraft:wooden_door', 'minecraft:iron_door', 'minecraft:trapdoor',
    'minecraft:glass', 'minecraft:glass_pane',
    'minecraft:acacia_door', 'minecraft:birch_door', 'minecraft:crimson_door', 'minecraft:dark_oak_door',
    'minecraft:jungle_door', 'minecraft:oak_door', 'minecraft:spruce_door', 'minecraft:warped_door',
    'minecraft:mangrove_door', 'minecraft:cherry_door', 'minecraft:bamboo_door',
    'minecraft:acacia_trapdoor', 'minecraft:birch_trapdoor', 'minecraft:crimson_trapdoor', 'minecraft:dark_oak_trapdoor',
    'minecraft:jungle_trapdoor', 'minecraft:oak_trapdoor', 'minecraft:spruce_trapdoor', 'minecraft:warped_trapdoor',
    'minecraft:mangrove_trapdoor', 'minecraft:cherry_trapdoor', 'minecraft:bamboo_trapdoor', 'minecraft:fern'
];

const excludedTags: string[] = [
    'plant', 'leaves', 'minecraft:is_hoe_item_destructible', 'minecraft:crop'
];

function updateFenceConnections(block: Block) {
    const neighbors = { north: block.north(), south: block.south(), east:  block.east(), west:  block.west() };

    const newStates = {
        [`${PACK_ID}:north_picket`]: neighbors.north && !excludedTypes.includes(neighbors.north.typeId)  && !excludedTags.some(tag => neighbors.north?.hasTag(tag)) ? 1 : 0,
        [`${PACK_ID}:south_picket`]: neighbors.south && !excludedTypes.includes(neighbors.south.typeId)  && !excludedTags.some(tag => neighbors.south?.hasTag(tag)) ? 1 : 0,
        [`${PACK_ID}:east_picket`]:  neighbors.east  && !excludedTypes.includes(neighbors.east.typeId )  && !excludedTags.some(tag => neighbors.east?.hasTag(tag) ) ? 1 : 0,
        [`${PACK_ID}:west_picket`]:  neighbors.west  && !excludedTypes.includes(neighbors.west.typeId )  && !excludedTags.some(tag => neighbors.west?.hasTag(tag) ) ? 1 : 0
    };

    const updatedPermutation = BlockPermutation.resolve(block.typeId, {
        ...block.permutation.getAllStates(),
        ...newStates
    });

    block.setPermutation(updatedPermutation);
}


export class FenceComponent implements BlockCustomComponent {
    public static readonly id = `${PACK_ID}:fence`;
    private readonly placedBit = `${PACK_ID}:is_item_icon` as keyof BlockStateSuperset;
    constructor() {
        this.onPlace = this.onPlace.bind(this);
    }
    
    public onPlace(event: BlockComponentOnPlaceEvent): void {
        const block: Block = event.block;
        const currentStates = block.permutation.getAllStates();
        const updatedStates = { ...currentStates, [this.placedBit]: false };
        block.setPermutation(BlockPermutation.resolve(block.typeId, updatedStates));

        // Update the fence just placed
        updateFenceConnections(block);

        // Update surrounding cardinal fences
        for (const neighbor of [block.north(), block.south(), block.east(), block.west()]) {
            if (neighbor?.hasTag(`${PACK_ID}:custom_fence`)) {
                updateFenceConnections(neighbor);
            }
        }
    }

}

// Also update adjacent fences when a fence is broken
world.afterEvents.playerBreakBlock.subscribe(e => {
    const { block } = e;

    for (const neighbor of [block.north(), block.south(), block.east(), block.west()]) {
        if (neighbor?.hasTag(`${PACK_ID}:custom_fence`)) {
            updateFenceConnections(neighbor);
        }
    }
});

world.afterEvents.playerPlaceBlock.subscribe(e => {
    const { block } = e;
    if (block.hasTag(`${PACK_ID}:custom_fence`)) return;
    for (const neighbor of [block.north(), block.south(), block.east(), block.west()]) {
        if (neighbor?.hasTag(`${PACK_ID}:custom_fence`)) {
            updateFenceConnections(neighbor);
        }
    }
});