import 'angular2/bundles/angular2-polyfills.js';
import 'zone.js';
import 'reflect-metadata';

import {createStore} from "redux";
import {CountActions, count} from "./sample/redux/countActions";

/*
const appReducer = (state = {}, action) => {
    return {
        count: reduxReducer(state.count, action)
    }
}
*/
import {appReducer} from "./appReducer";
const appStore = createStore(appReducer);

import {Component} from "angular2/core";
import {SampleComponent} from "./sample/sample";
@Component({
    selector: 'app',
    directives: [SampleComponent],
    template: `<div>
        <h1>Hello {{ name }}!</h1>
        <sample></sample>
    </div>`
})
class App {
    name: string;

        constructor(){
            this.name = 'Angular2';
            setTimeout(() => {
                this.name = 'Boy'
        }, 2000);
    }
}

import {bootstrap} from 'angular2/platform/browser';
import {provide, ApplicationRef} from 'angular2/core';
bootstrap(App, [
    provide('AppStore', {useValue: appStore}),
    CountActions
]);