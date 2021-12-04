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

App.init(/* app root element */);

```

3. define an element.

```js
// index.js

import { Xui, XuiElement, Variable } from 'xuijs';

export class CountUp extends XuiElement {

  constructor(el) {
      super(el);

      this.count = new Variable(0);
  }

  getCount(count) {
      return count;
  }

  onMount() {
      window.setInterval(() => this.count++, 1000);
  }
}

```

4. use the element.

```html
<body>
  <div $init mount="index:CountUp">
      <span $bind:.inner-text="count@getCount"></span>
  </div>
</body>
```

5. bundle with your favourite bundeler.

# docs

see [docs/](https://github.com/0xc0Der/xuijs/tree/main/docs "docs/") folder for more details.

# examples

see [examples/](https://github.com/0xc0Der/xuijs/tree/main/examples "examples/") folder for example projects.
