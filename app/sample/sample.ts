import {Component} from "angular2/core";
import {MaterialComponent} from "./material/material";
import {ReduxComponent} from "./redux/redux";
import {NgrxComponent} from "./ngrx/ngrx";

@Component({
    selector: "sample",
    template: `<div>
        <material></material>
        <redux></redux>
        <hr>
        <ngrx></ngrx>
    </div>`,
    directives: [MaterialComponent, ReduxComponent, NgrxComponent]
})
export class SampleComponent {}