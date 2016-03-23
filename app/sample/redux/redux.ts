import {Component, Inject} from "angular2/core";
import {CountActions} from "./countActions";

@Component({
    selector: "redux",
    template: `<div>
       <hr>
       <h2>Redux Count</h2>
       <button (click)="inc()"><b>+</b></button>
       <button (click)="dec()"><b>-</b></button>
       <button (click)="res()"><b>0</b></button>
       <h3>{{s.getState().count}}</h3>
    </div>`
})
export class ReduxComponent {
//    counter: number;
    constructor(
        @Inject('AppStore')
        public s: AppStore,
        public a: CountActions
    ) {
      // this.unsubscribe = this.s.subscribe(() => {
      //      let state = this.s.getState();
      //      this.counter = state.count;
      //  });
    }
    inc() {this.s.dispatch(this.a.countInc());}
    dec() {this.s.dispatch(this.a.countDec());}
    res() {this.s.dispatch(this.a.countRes());}

//methinks: the diversion over a class variable and subscribe
//          is only necessary if the displayed expression becomes
//          too complex!
/*
    private ngOnInit(){
        this.s.subscribe(() => {
            this.counter = this.s.getState().count;
        });
    }

    private ngOnDestroy() {
        this.s.subscribe();     // unsubscribe() == subscribe(<empty>) ??
    }
*/
}