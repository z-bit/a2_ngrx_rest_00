import {Component, Input, Output, EventEmitter} from "angular2/core"
import {Item} from "./itemDetailActions";

@Component({
    selector: "item-detail",
    template: `<div>
        <div class="item-card mdl-card mdl-shadow--2dp">
            <div class="mdl-card__title">
                <h2 class="mdl-card__title-text" *ngIf="selectedItem.id"> Editing {{ originalName }}</h2>
                <h2 class="mdl-card__title-text" *ngIf="!selectedItem.id">Create New Item</h2>
            </div>
            <div class="mdl-card__supporting-text">
                <form novalidate>
                    <div class="mdl-textfield mdl-js-textfield">
                        <label>Item Name</label>
                        <input  [(ngModel)]="selectedItem.name"
                                placeholder="Enter a name"
                                class="mdl-textfield__input" type="text"
                        >
                    </div>
                </form>
            </div>
            <div class="mdl-card__actions">
                <button type="submit" (click)="cancelled.emit(selectedItem)"
                        class="mdl-button mdl-js-button mdl-js-ripple-effect">
                    Cancel
                </button>
                <button type="submit" (click)="saved.emit(selectedItem)"
                        class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--colored">
                    Save
                </button>
            </div>
        </div>
    </div>`
})
export class ItemDetail {
    @Input('item') _item: Item;
    originalName: string;
    selectedItem: Item;
    @Output() saved = new EventEmitter();
    @Output() cancelled = new EventEmitter();

    set _item(value: Item){
        if (value) {
            this.originalName = value.name;
            this.selectedItem = Object.assign({}, value);
        }
    }
}