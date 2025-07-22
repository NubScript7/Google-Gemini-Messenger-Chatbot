export const corsOptions = {
  origin: [ "http://localhost:7700", "http://localhost:2468" ],
  /*function (origin: any, callback: any) {
    
    const origins = [ "http://localhost:7700" ];
    
    const error = undefined
    
    callback( error, origins);
    
  }
  */
  method: [ "POST", "GET" ]
}