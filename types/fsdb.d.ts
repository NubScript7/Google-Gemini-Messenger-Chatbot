type PasswordLike = string | number;
export declare function fileExists(path: string): Promise<boolean>;
declare class Ref {
    private _path;
    private _val;
    private _onValueUpdate;
    constructor(path: string, content: any);
    addEventListener(listener: (...args: any[]) => any): void;
    removeEventListener(target: (...args: any[]) => any): void;
    set path(newPath: string);
    get path(): string;
    set val(newVal: any);
    get val(): any;
}
declare class Fsdb {
    #private;
    private _path;
    private _content;
    private _unlabelledValues;
    private _db;
    private _rootRef;
    constructor(path?: string, password?: PasswordLike);
    init(): Promise<void>;
    ref(path: string): Ref | undefined;
    set(object: Object): void;
}
export declare const db: Fsdb;
export {};
