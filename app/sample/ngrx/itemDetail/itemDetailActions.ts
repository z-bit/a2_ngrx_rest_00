import {Injectable} from "angular2/core";

export const SELECT_ITEM = "SELECT_ITEM";

export interface Item {
    id: number;
    name: string;
    description: string;
}

// action creators
@Injectable()
export class ItemDetailActions {
    selectItem(item:Item) {
        return {}
    }
}

// reducer
export const selectedItem = (state: any = null, {type, payload}) => {
    switch(type) {
        case SELECT_ITEM:
            return payload;
        default:
            return state;
    }
};