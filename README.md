# Xuijs

A javascript runtime library for creating reactive user interfaces.

# features

Xuijs is a set of tools that makes it so easy to add reactivity to your UIs.

- no vdom
- very lightweight.
- very fast.
- unopinionated.
- extendable to infinity.

# usage

1. download the package using npm.

```bash

$ npm i xuijs

```

2. define the App.

```js
import { Xui } from 'xuijs';

const App = new Xui();

App.init(document.body);
```

3. define an element.

```js
// index.js

import { XuiElement, Variable } from 'xuijs';

export class Ticker extends XuiElement {
  constructor(el) {
    super(el);

    this.ticks = new Variable(0);
    this.state = new Variable(false);
  }

  getTicks(ticks) {
    return `${ticks}`;
  }

  resetTicks() {
    this.ticks.value = 0;
  }

  getState(state) {
    return state ? 'stop' : 'start';
  }

  switchState() {
    if (this.state.value) {
      window.clearInterval(this.ticker);
    } else {
      this.ticker = window.setInterval(() => this.ticks.value++, 1000);
    }

    this.state.value = !this.state.value;
  }
}
```

4. use the element.

```html
<body>
  <div $init mount=":Ticker">
    <span $bind:.inner-text="ticks@getTicks">0</span>
    <div $init>
      <button $event:click="@switchState" $bind:.inner-text="state@getState">
        start
      </button>
      <button $event:click="@resetTicks">reset</button>
    </div>
  </div>
</body>
```

5. bundle with your favourite bundeler.

# docs

see [docs/](https://github.com/0xc0Der/xuijs/tree/main/docs 'docs/') folder for more details.

# examples

see [examples/](https://github.com/0xc0Der/xuijs/tree/main/examples 'examples/') folder for example projects.
