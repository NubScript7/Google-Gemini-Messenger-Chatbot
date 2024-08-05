function func(num) {
    switch(num) {
        
        case 1:
        {
            console.log("hello world num 1")
            return;
            console.log("did it work? num 1")
        } break;
        
        case 2:
        {
            console.log("hello world num 2")
            break;
            console.log("did it work? num 2")
        } break;
        
        case 3: {
            console.log("nutrhin")
        } break;
    }
    
    console.log("reached end of function")
}

func(2);