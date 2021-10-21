# Xuijs

A javascript library for creating reactive user interfaces.

# features

Xuijs is a set of tools that makes it so easy to add reactivity to your UIs.

- no vdom
- very lightweight.
- unopinionated.
- extendable to infinity.

# usage

```html
<div $init mount="index:CountUp">
    <span *.inner-text="count"></span>
</div>
```

```js
// index.js

export class CountUp extends XuiElement {

    constructor(el) {
        super(el);

        this.defineData('count', 0);
    }

    onMount() {
        window.setInterval(() => this.count++, 1000);
    }
}

Xui.init(document.body);

```

see [docs/](https://github.com/0xc0Der/xuijs/tree/main/docs "docs/") folder for more details.

# examples

see [examples/](https://github.com/0xc0Der/xuijs/tree/main/examples "examples/") folder for example projects.
