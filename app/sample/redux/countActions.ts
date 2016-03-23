const COUNT_INC = "COUNT_INC";
const COUNT_DEC = "COUNT_DEC";
const COUNT_RES = "COUNT_RES";

export class CountActions {
    countInc() {
        return {type: COUNT_INC};
    }

    countDec() {
        return {type: COUNT_DEC};
    }

    countRes() {
        return {type: COUNT_RES};
    }
}

//reducer
export function count(state = 0, action) {
    switch(action.type){
        case COUNT_INC: return state + 1;
        case COUNT_DEC: return state - 1;
        case COUNT_RES: return 0;
        default: return state;
    }
}

