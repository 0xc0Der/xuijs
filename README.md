# Xuijs

A javascript library for creating reactive user interfaces.

# features

Xuijs is a lightweight set of tools that makes it so easy to add reactivity to your UIs.

- no vdom
- very lightweight.
- unopinionated.
- extendable to infinity.

# usage

At first a call to `init()` is needed to run Xuijs on an HTML root element.

```js
Xui.init(rootElement[, data[, funcs[, handel]]]);
```

## mounting

`init()` finds all the elements with `mount="file/path[:class]"` attribute and mounts them.

- **data**: is any data you want to pass to `mount()` of each mounted element.
- **funcs**: is an object `{ before: 'onBeforeMount', after: 'onMount' }` of life cycle methods.
- **handel**: is a function to handel contoller attributes. the default form is `$name[:...params]="value"`.

then `mount()` gets called for each mounted element. first it calles `funcs.before()`,
handels controller attributes then calles `funcs.after()`.

## mount()

**definition**: `mount(element[, data[, funcs[, handel]]])`.

what it does is:

- calles `funcs.before()`.
- handels constroller attributes `$name[:...params]="value"` by calling `[name]({ value, params }, data)`.
- calles `funcs.after()`.

## unMount()

**definition**: `unMount(elem, data, func = 'onUnmount')`;

## signaling

To register an element use `register()` method.

```js
Signal.register('name', objectContainsSignalHandelers);

const objectContainsSignalHandelers = {
  sigAdd(data) {
    // ...
    return result; // return a response back.
  }
}
```

<br/>

To send a signal use `send()` method.

```js
Signal.send('name', info);
```

`info` is an object `{ prefix: '', signal: 'signal', data }`.

<br/>

To call the signal handeler `sigAdd`. `info` = `{ prefix: 'sig', signal: 'Add', data }`.

<br/>

Signals can return values.

```js
const result = await Signal.send('name', info);
```

<br/>

prodcast a signal using `prodcast(info[, pattern = /.+/])`.

it returns an iterator of the results.

## variables

Variables are a core part of Xuijs.

<br/>

to create a variable use `Var(initValue)` constructor.

```js
class InputElem extends Elem {
  #str = new Var('');

  // ...

  #setStr(value) {
    this.#str.value = value;
  }

  #getStr() {
    return this.#str.value;
  }

}
```

To add a function to run each time `#str` changes use `#str.observer()`.

```js
// adding two functions.

#str.observer((value, prevValue) => {
  console.log(`${prevValue} have been changed to ${value}`);
});

#str.observer(value => {
  console.log(`current value is ${value % 2 == 0 ? 'even' : 'odd'}`)
});
```

# examples

see `examples/` folder for example projects.
