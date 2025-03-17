import { Block, Direction } from "@minecraft/server";
import { Vector3 } from "./vector";

export enum RedstoneEmitterType {
    Button
}

const redstoneBlocks: string[] = [
    'minecraft:dropper',
    'minecraft:dispenser'
];

class Redstone {
    private constructor(){}

    //Returns true if redstone signal was emitted
    public emitSignal(block: Block, emitterType: RedstoneEmitterType,  emissionStrength: number = 15): boolean {
        if (emissionStrength < 1 || emissionStrength > 15) throw Error(`${block.typeId}: Emission signal must have a strength in rage of 1-15.`);
        let blockToPower: Block | undefined;
        if (emitterType === RedstoneEmitterType.Button) blockToPower = this.processButton(block);
        if (blockToPower) {
            this.powerRedstoneBlock(blockToPower);
            return true;
        }
        return false;
    }

    private processButton(block: Block): Block | undefined {
        const face = block.permutation.getState('minecraft:block_face') as string;
        const direction = face.charAt(0).toUpperCase() + face.slice(1) as Direction;

        const checkNeighbors = ((distance: number = 1): Block | undefined =>{
            if (direction === Direction.East) return block.west(distance);
        })

        let targetBlock: Block | undefined = checkNeighbors();
        
        if (targetBlock !== undefined && this.isRedstoneBlock(targetBlock.typeId)) {
            return targetBlock;
        } 
        return undefined;
    }

    private isRedstoneBlock(typeId: string): boolean {
        if (redstoneBlocks.includes(typeId)) return true;
        return false;
    }

    private powerRedstoneBlock(block: Block): void {
        console.warn(`trying to power: ${block.typeId}`)
    }

    public static create(): Redstone {
        return new Redstone();
    }
}

class AfterEvents {
    private constructor() {
        //this.SignalRecivedEvent = ExampleEventSignal.create();
    }

    //readonly SignalRecivedEvent: ExampleEventSignal;

    static create(): AfterEvents {
        return new AfterEvents();
    }
}

export const redstone: Redstone = Redstone.create();