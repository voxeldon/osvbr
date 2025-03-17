import { system } from "@minecraft/server";

export abstract class McNode {
    private processId: number;
    private lastTime: number;
    public runProcess: boolean = true;

    constructor(){
        this.onReady();
        this.lastTime = Date.now();
        this.processId = system.runInterval(() => {
            if (!this.runProcess) return;
            const currentTime = Date.now();
            const deltaTime = (currentTime - this.lastTime) / 1000;
            this.processDelta(deltaTime);
            this.lastTime = currentTime;
        });
    }
    public abstract onReady(): void;
    public abstract processDelta(delta: number): void;
    protected killProcess(): void {
        system.clearRun(this.processId)
    }
}
