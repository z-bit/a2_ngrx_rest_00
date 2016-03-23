import {Component} from "angular2/core";
import {MaterialComponent} from "./material/material";
import {ReduxComponent} from "./redux/redux";

@Component({
    selector: "sample",
    template: `<div>
        <material></material>
        <redux></redux>
    </div>`,
    directives: [MaterialComponent, ReduxComponent]
})
export class SampleComponent {}