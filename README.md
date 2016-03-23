## a2_ngrx_rest_00
### Lukas Ruebbelke [Build a Better Angular 2 Application with Redux and ngrx](http://onehungrymind.com/build-better-angular-2-application-redux-ngrx/)
Version 00
#### Start with a2_grajm
<pre><code>
$ git clone https://github.com/z-bit/a2_grajm.git a2_ngrx_rest_00
$ cd a2_ngrx_rest_00
$ npm install 
$ jspm install 
$ live-serve                            => works
</code></pre>
#### Exted it to ngrx and REST
* remeber: **problems with angular2@2.0.0-beta.11 (beta.9 fine)**
* jspm install @ngrx/store **failed** because it implicitly updates angular2 to beta.11
* npm install --save @ngrx/store **failed** for missing dependencies

<pre><code>
$ npm install --save rxjs                       //missing dependency
$ npm install --save angular2@2.0.0-beta.9      //missing dependency
$ npm install --save @ngrx/store
</code></pre>

* run code with live-server ==> **works**
