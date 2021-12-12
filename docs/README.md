# initializing your app

```js
import { Xui } from 'xuijs';

const App = new Xui();

App.init(rootElement);
```

# mounting an element

```html
<div mount="[file/path][:class]"></div>
<!-- no file extension -->
```

- if no file path given it will default to `./index.js`.
- if no class given it will default to the `default`.

to prevent mounting the element at startup add `prevent` attribute.

```js

import { XuiElement } from 'xuijs';

export class [class name] extends XuiElement {
  constructor(el) {
    // el is the DOM element.

    super(el); // must call
  }
}

```

# attributes

predefined attributes in `XuiElement` are:

`$init`, `$bind`, `$event`, `$name`, `$for`, `$if`, `$elif`, `$else`

## `$bind`.

format: `$bind:.prop-name|attr-name="variable@function"`.

binds the property value `ex. .inner-text` or the attribute value `ex. class` to the return value of the `function` which takes the current value of the `variable` as an argument.

## `$event`.

format: `$event:event-name="@function"`.

the `function` is an event handeler that takes the `event` as an argumant.

## `$init`.

format: `$init="[scope]"`.

it is used to initialize the child elements of the holder element.

- `scope` is optional.

## `$name`.

format: `$name=".name|name@SignalsDispatcher"`.

it is used to register an elment in a `SignalsDispatcher`.

- `.name` means the value of the variable `name`.

## `$for`.

format: `$for:key-prefix="variable@function"`.

loop over the values of `variable`.

`function = function(keyPrefix, { list, oldList }, el)` returns another `function = function({ key, value })` that runs for each element.

## `$if`.

format: `$if[:scope-name]="variable@function"`.

the `function` returns `false` or a `function` which represent the body of `if`.

- `function = function(VariableValue, DOMElement)`.
- the returned function takes no arguments.
- scope is optional if it is defined in `$init`.

## `$elif`.

format: `$elif[:scope-name]="@function"`.

should be in the same scope as its `if`.

the `function` returns `false` or a `function` which represent the body of `elif`.

- `function = function(VariableValue, DOMElement)`.
- the returned function takes no arguments.

## `$else`.

format: `$else[:scope-name]="@function"`.

should be in the same scope as its `if`.

- `function = function(VariableValue, DOMElement)`.

# custom attributes

inside the element define a function on the form `$attrname`.

```js
export class MyElement extends XuiElement {
  // ...

  $myattr({ params, value }, el) {
    // `params` is an array.
    // `value` is an object { variable, func }.
    // assuming that `value` takes the form `variable@func`.
    // `el` is the DOM element.
    // implementation.
  }

  // ...
}
```

then use it in the HTML.

```html
<div $myattr[:param:...]="variable@func"></div>
```

# variables

```js
import { Variable } from 'xuijs';

export class MyElement extends XuiElement {
  myVar = new Variable(initialValue);

  setMyVar(newValue) {
    this.myVar.value = newValue;
  }

  getMyVar() {
    return this.myVar.value;
  }

  addObserverToMyVar() {
    this.myVar.addObserver((newValue, oldValue) => {
      // gets called whenever `myVar` changes.
    });
  }
}
```

# signals

define a global `SignalsDispatcher`.

```js
import { SignalsDispatcher } from 'xuijs';

window.Signals = new SignalsDispatcher();
```

register an element.

```js
Signals.register('name', Element);
```

send or prodcast a signal.

```js
const returnValuePromise = Signals.send('name', {
  signals: 'signalName',
  data: 'data to send'
});

// to prodcat to all registered.
const iteratorOfPromises = Signals.prodcast(
  {
    signal: 'signalName',
    data: 'data to send'
  } /* , optional regex */
);
```

in the element define a signal handeler.

```js

// ...

  signalName(data) {
    // ...

    // optionally return a response.
  }

// ...

```

unregister an element.

```js
Signals.unregister('name');
```
