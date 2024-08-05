import fs, { constants } from "fs/promises";
import { PathLike } from "fs";
import { resolvePath, writeSecure } from "./encryptor";
import { resolve } from "path";

type PasswordLike = string | number;

interface AnyObjectType {
  [key: string | number | symbol]: any;
}

export async function fileExists(path: string) {
  try {
    await fs.access(resolvePath(path), constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

class Ref {
  private _path: string;
  private _val: any;
  private _onValueUpdate: ((...args: any[]) => any)[];

  constructor(path: string, content: any) {
    this._path = path;
    this._val = content;
    this._onValueUpdate = [];
  }
  
  
  
  addEventListener(listener: (...args: any[]) => any) {
    if(typeof listener !== "function")
        throw new TypeError("The listener is not a type of function.");
    this._onValueUpdate.push(listener);
  }
  
  removeEventListener(target: (...args: any[]) => any) {
    if(typeof target !== "function")
      throw new TypeError("The listener is not a type of function.");
    this._onValueUpdate = this._onValueUpdate.filter(listener => listener !== target);
  }

  set path(newPath: string) {
    this._path = newPath;
  }
  
  get path() {
    return this._path;
  }
  
  set val(newVal: any) {
    this._val = newVal; 
  }
  
  get val() {
    return this._val;
  }
}

class FsdbError extends Error {
  constructor(message: string) {
    super(message);
  }
}

function isObject(value: any) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

class Fsdb {
  private _path: string;
  private _content: any;
  private _unlabelledValues: any[];
  private _db: AnyObjectType;
  private _rootRef: Ref;
  #password?: PasswordLike;

  constructor(path: string = ".default@fsdb.db", password?: PasswordLike) {
    this._path = path;
    this._content = null;
    this._db = {};
    this._unlabelledValues = [];
    this._rootRef = new Ref("/",this._db);
    this._rootRef.addEventListener(this.#refUpdateListener);
    if (password &&
      typeof password !== "string" &&
      typeof password !== "number"
    )
      throw new FsdbError(
        "Cannot set password, not a type of string or number"
      );
    this.#password = password;
  }
  
  #refUpdateListener(pathStr: string, value: any) {
    const pathArray = pathStr.split("/");
    let val: any = this._db;
    for (const path of pathArray) {
      val = val[path]
    }
    val = value;
  }

  async init() {
    const exists = await fileExists(this._path);
    
    
    if (exists) {
      const json = await fs.readFile(this._path, "utf8");
      
      const content = JSON.parse(json);

      if (!isObject(content)) {

        this._unlabelledValues.push(content);
        Object.defineProperty(this._db, "_unlabelledValues", {
          value: this._unlabelledValues
        });
        
      } else {

        this._db = content;
        this._rootRef = new Ref("/" , this._db);

      }

    } else {

      if(this.#password) {

        writeSecure(this._path, JSON.stringify(this._db), this.#password);
        
      } else {

        fs.writeFile(this._path, JSON.stringify(this._db));
        
      }

    }
  }

  ref(path: string) {
    if(typeof path !== "string")
        throw new FsdbError("Path is not a type of string.");
    const parts = path.split("/");
    let val: any;
    if (parts.length === 1 && (parts[0] === '' || parts[0] === '/'))
        return this._rootRef;
    for (const part of parts) {
      const db_value = this._db[part];
      
      if (!db_value) return undefined;
      val = db_value;
    }
    return new Ref(path, val);
  }
  
  set(object: Object) {
    this._db
  }
}

export const db = new Fsdb();
