import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from "angular2/core";
import {ItemListActions} from "./itemList/itemListActions";
import {ItemDetailActions, Item} from "./itemDetail/itemDetailActions";
import {Observable} from "rxjs/Observable";
import {Store} from "@ngrx/store";
import {ItemList} from "./itemList/itemList";
import {ItemDetail} from "./itemDetail/itemDetail";
import {SELECT_ITEM} from "./itemDetail/itemDetailActions";

export interface NgrxStore {
    items: Item[],
    selectedItem: Item
}

@Component({
    selector: "ngrx",
    providers: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
    directives: [ItemList, ItemDetail],
    template:`<div>
        <div class="mdl-cell mdl-cell--6-col">
            <item-list
                    [items]="item | async"
                    (selected)="selectItem($event)"
                    (deleted) ="deleteItem($event)">
            </item-list>
            <item-detail
                    [item]="selectedItem | async"
                    (saved)="saveItem($event)"
                    (cancelled)="resetItem($event)">
                Select an item
            </item-detail>
        </div>
    </div>`
})
export class NgrxComponent{
    items: Observable<Array<Item>>;
    selectedItem: Observable<Item>;

    constructor(
        private itemListActions: ItemListActions,
        private itemDetailActions: ItemDetailActions,
        private store: Store<NgrxStore>
    ){
        this.items = itemListActions.items;
        this.selectedItem = store.select('selectedItem');
        this.selectedItem.subscribe(v => console.log(v));

        itemListActions.loadItems();
    }

    resetItem(){
        let emptyItem: Item = {id: null, name: "", description: ""};
        this.store.dispatch({type: SELECT_ITEM, payload: emptyItem});
    }

    selectItem(item: Item){
        this.store.dispatch({type: SELECT_ITEM, payload: item})
    }

    saveItem(item: Item){
        this.itemListActions.saveItem(item);
        // Generally, we would want to wait for the result of `itemsService.saveItem`
        // before resetting the current item. ????
        this.resetItem();
    }

    deleteItem(item: Item){
        this.itemListActions.deleteItem(item);
        // Generally, we would want to wait for the result of `itemsService.saveItem`
        // before resetting the current item. ????
        this.resetItem();
    }



}