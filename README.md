# Angular2 load-children loader

[![Greenkeeper badge](https://badges.greenkeeper.io/Quramy/angular2-load-children-loader.svg)](https://greenkeeper.io/)

This is a webpack loader to [Angular2 lazy module loading](https://angular.io/docs/ts/latest/guide/router.html#!#asynchronous-routing).

It's recommended to use this loader with webpack 2.x.

* INPUT:

```ts
export const appRoutes: Routes = [
  {path: "", component: MainHomeComponent},
  {path: "about", component: MainAboutComponent },
  {path: "sub", loadChildren: "./sub.module#SubModule" },
];
```

* OUTPUT:

```ts
export const appRoutes: Routes = [
  {path: "", component: MainHomeComponent},
  {path: "about", component: MainAboutComponent },
  {path: "sub", loadChildren: () => require("./sub.module")("SubModule") },
];
```

And this loader return a function to call the `require` function with `.ngfactory` suffix if the resource is generated by compiler-cli:

```
export const appRoutes: Routes = [
  {path: "", component: MainHomeComponent},
  {path: "about", component: MainAboutComponent },
  {path: "sub", loadChildren: () => require("./sub.module.ngfactory")("SubModuleNgFactory") },
];
```

## Install

```sh
npm install angular2-load-children-loader -D
```

```sh
npm install @types/node -D
```

or 

```sh
typings install node
```

## Using with es6-promise-loader

```ts
export const appRoutes: Routes = [
  {path: "", component: MainHomeComponent},
  {path: "about", component: MainAboutComponent },
  {path: "sub", loadChildren: "es6-promise!./sub.module#SubModule"}
];
```

## Working demonstration

The following repository uses this loader:

[Quramy/ng2-lazy-load-demo](https://github.com/Quramy/ng2-lazy-load-demo)


## Why?

To load sub modules asynchronously with webpack, you use only [es6-promise-loader](https://github.com/gdi2290/es6-promise-loader). For example:

```ts
import { Routes, RouterModule } from "@angular/router";
import { MainHomeComponent } from "./main-home.component";
import { MainAboutComponent } from "./main-about.component";

export function loadSubModule(): any {
  return require("es6-promise!../sub/sub.module")("SubModule");
}

export const appRoutes: Routes = [
  {path: "", component: MainHomeComponent},
  {path: "about", component: MainAboutComponent },
  {path: "sub", loadChildren: loadSubModule},
];
```

OK, it works pretty well. But wait. It doesn't work in Angular2 AoT(offline compile) mode.

In AoT context the `loadSubModule` function should return not `SubModule` but `SubModuleNgFactory`(generated by the `ngc` command).
In other words, **to keep routing configurations to work in the both JiT and AoT context, you should switch the sub module to load** as this loader does.

## License
MIT
