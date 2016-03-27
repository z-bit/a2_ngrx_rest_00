import {Http, Headers} from "angular2/http";
import {Store} from "@ngrx/store";
import {Injectable} from "angular2/core";
import {Observable} from "rxjs/Observable";
import {Item} from "../itemDetail/itemDetailActions";
import {NgrxStore} from "../ngrx";

const BASE_URL = "http://localhost:8080/ngrx/items";
const HEADER = {headers: new Headers({"Content-Type": "application/json"})};

const ITEM_ADD = "ITEM_ADD";
const ITEM_NEW = "ITEM_NEW";
const ITEM_UPD = "ITEM_UPD";
const ITEM_DEL = "ITEM_DEL";

// action creators
@Injectable()
export class ItemListActions {
    items: Observable<Array<Item>>;

    constructor(
        private http: Http,
        private store: Store<NgrxStore>
    ){
        this.items = this.store.select('items');
    }

    loadItems() {
        this.http.get(BASE_URL)
            .map(res => res.json())
            .map(payload => ({type: ITEM_ADD, payload}))
            .subscribe(action => this.store.dispatch(action))
        ;
    }

    saveItem(item: Item) {
        (item.id)
            ? this.updateItem(item)
            : this.createItem(item)
        ;
    }

    createItem(item) {
        this.http.post(`${BASE_URL}`, JSON.stringify(item), HEADER)
            .map(res => res.json())
            .map(payload => ({type: ITEM_ADD, payload: item}))
            .subscribe(action => this.store.dispatch(action))
        ;
    }

    updateItem(item: Item) {
        this.http.put(`${BASE_URL}${item.id}`, JSON.stringify(item), HEADER)
            .subscribe(action => this.store.dispatch({type: ITEM_UPD, payload: item}))
        ;
    }

    deleteItem(item: Item) {
        this.http.delete(`${BASE_URL}${item.id}`)
            .subscribe(action => this.store.dispatch({type: ITEM_DEL, payload: item}))
        ;
    }
}

// reducer
export const items = (state: any = [], {type, payload}) => {
    let index: number;

    switch(type) {
        case ITEM_ADD:
            return payload;
        case ITEM_NEW:
            return [...state, payload];
        case ITEM_UPD:
            return state.map(item => {
                return item.id === payload.id
                ? Object.assign({}, item, payload)
                : item;
            });
        case ITEM_DEL:
            return state.filter(item => {
                return item.id !== payload.id;
            });
        default:
            return state;
    }
};

