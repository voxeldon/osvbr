import { Block, Dimension, Direction } from "@minecraft/server";
import { Vector3 } from "../_lib/vector";

export interface BlockNeighbors {
    north?: Block;
    south?: Block;
    east?:  Block;
    west?:  Block;
    above?: Block;
    below?: Block;
}

export class Common {
    public static getAdjacentBlock(face: Direction, dimension: Dimension, location: Vector3): Block | undefined{
        let offset: Vector3 = Vector3.ZERO;
        switch (face) {
            case Direction.North: offset = new Vector3(0,0,-1); break;
            case Direction.South: offset = new Vector3(0,0,1) ; break;
            case Direction.East : offset = new Vector3(1,0,0); break;
            case Direction.West : offset = new Vector3(-1,0,0) ; break;
            case Direction.Up   : offset = new Vector3(0,1,0) ; break;
            case Direction.Down : offset = new Vector3(0,-1,0); break;
        }
        return dimension.getBlock(Vector3.add(location, offset));
    }

    public static getBlockNeighbors(block: Block, invalidTypes: string[] = [], invalidTags: string[] = [], invalidCoreTypes: string[] = []): BlockNeighbors {
        const directions: (keyof BlockNeighbors)[] = ['north', 'south', 'east', 'west', 'above', 'below'];
    
        const neighbors = directions.reduce((acc, direction) => {
            const neighbor = (block as Block)[direction]();
            if (neighbor && !invalidTypes.includes(neighbor.typeId) && !invalidTags.some(tag => neighbor.hasTag(tag)) && !neighbor.isAir && !neighbor.isLiquid && !invalidCoreTypes.some(type => neighbor.typeId.includes(type))) {
                acc[direction] = neighbor;
            }
            return acc;
        }, {} as BlockNeighbors);
    
        return neighbors;
    }

    public static getNeighborIterator(neighbors: BlockNeighbors): Block[] {
        const blocks: Block[] = [];
        if (neighbors.north) blocks.push(neighbors.north);
        if (neighbors.south) blocks.push(neighbors.south);
        if (neighbors.east) blocks.push(neighbors.east);
        if (neighbors.west) blocks.push(neighbors.west);
        if (neighbors.above) blocks.push(neighbors.above);
        if (neighbors.below) blocks.push(neighbors.below);
        return blocks;
    }
    
}