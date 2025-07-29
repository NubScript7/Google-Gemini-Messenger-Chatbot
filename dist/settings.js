"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
exports.corsOptions = {
    origin: ["http://localhost:7700", "http://localhost:2468"],
    /*function (origin: any, callback: any) {
      
      const origins = [ "http://localhost:7700" ];
      
      const error = undefined
      
      callback( error, origins);
      
    }
    */
    method: ["POST", "GET"]
};
