import {Component, Input, Output, EventEmitter} from "angular2/core";
import {Item} from "../itemDetail/itemDetailActions";

@Component({
    selector: "item-list",
    template: `<div>
        <div *ngFor="#item of items" (click)="selcted.emit(item)"
             class="item-card mdl-card mdl-shadow--2dp">
             <div class="mdl-card__title">
                <h2 class="mdl-card__title-text">{{ item.name }}</h2>
             </div>
             <div class="mdl-card__supporting-text">
                {{ item.description }}
             </div>
             <div class="mdl-card__menu">
                <button (click)="deleted.emit(item); $event.stopPropagation();"
                        class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
                    <i class="material-icons">close</i>
                </button>
             </div>
        </div>
    </div>`
})
export class ItemList {
    @Input() item: Item[];
    @Output selected = new EventEmitter();
    @Output deleted = new EventEmitter();
}
