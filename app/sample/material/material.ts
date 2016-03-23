import {MATERIAL_DIRECTIVES, MATERIAL_PROVIDERS} from "ng2-material/all";
import "app/app.css!";

import {Component} from "angular2/core";

@Component({
    selector: "material",
    templateUrl: "app/sample/material/material.html",
    directives: [MATERIAL_DIRECTIVES]
})
export class MaterialComponent {}