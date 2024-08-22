export declare const PREFIX = "!";
export type CommandStructure = {
    [commandName: string]: {
        default: string[] | ((...args: any) => string[]);
        run?: (output: string[], ...args: any[]) => void;
    };
};
export declare const COMMANDS: CommandStructure;
export declare function passAppVersion(version: string): void;
export declare function handleCommand(message: string, id: number | string): [string[], boolean];
