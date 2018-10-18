# Sling Framework

The Sling Framework provides the building blocks to create Sling-based web components:

### SlingElement

A class based on Google's [LitElement](https://github.com/Polymer/lit-element) that provides attribute/property handling and reflecting.

### html

A tagged template literal utility from [lit-html](https://polymer.github.io/lit-html/) that provides an expressive API to dynamically generate html that reacts effectively to the component's state.

### withRequest

A decorator that brings methods, properties and events for handling API requests.

### withSetState

A decorator that exposes a method that behaves much like [React's `setState`](https://reactjs.org/docs/state-and-lifecycle.html#using-state-correctly).


## SlingElement and html

To use the SlingElement class, we start by installing `sling-framework` from npm.

```bash
npm install --save sling-framework
```

Then, we import SlingElement and html in a javascript file.

```javascript
import { SlingElement, html } from 'sling-framework';
```

Usually, web components are javascript classes that extend HTMLElement. In our case, we extend SlingElement, which enhances HTMLElement with new behaviour.

To build a Star Rating component, we start by declaring a StarRating class that extends SlingElement.

```javascript
class StarRating extends SlingElement {}
```

In the constructor, we set initial values to the properties that the component will need. In our example, the `rate` property's initial value is zero.

```javascript
class StarRating extends SlingElement {
  constructor() {
    super();
    this.rate = 0;
  }
}
```

### Declaring properties

Next, we need to tell the component how to handle the `rate` property: 

- what type of value it can accept;
- whether the value can be set by an html attribute or not;
- and how the component should react when its value changes.

We do that by declaring a static getter called `properties`.

```javascript
class StarRating extends SlingElement {
  // ommited code

  static get properties() {
    return {
      rate: {
        type: Number,
        reflectToAttribute: true,
        observer: 'restrictRate',
      },
    };
  }
}
```

In our example, we tell the component that the `rate` property is a Number by assigning `type: Number`. The type can be any javascript primitive like Boolean or String.

We also tell the component that the `rate` property can be passed throught both html and javascript by assigning `reflectToAttribute: true`.

```html
<!-- Passing rate throught html -->
<star-rating rate="4"></star-rating>
```

```javascript
// Passing rate throught javascript
const starRatingElement = document.querySelector('star-rating');
starRatingElement.rate = 4;
```

If set to false, `reflectToAttribute` tells the component that the property can only be passed throught javascript. This is useful when dealing with complex values like objects or arrays; we usually don't want those being passed throught html.

With `observer: 'restrictRate'`, we tell the component how to react to the `rate` property changes. In our example, it should call the `restrictRate` method, that coerces its value to an integer between zero and five.

The `observer` method receives the current property value as the first parameter and the old property value as the second.

```javascript
class StarRating extends SlingElement {
  // ommited code

  restrictRate(newRate, oldRate) {
    if (Math.round(newRate) !== newRate || newRate < 0 || newRate > 5) {
      this.rate = Math.round(Math.max(0, Math.min(5, newRate)));
    }
  }
}
```

### Rendering html
So far, our component doesn't render anything. To change that, we implement the `render` method which is **always** called when a declared property changes.

Our `render` method draws five stars that are colored according to the current `rate` value.

```javascript
class StarRating extends SlingElement {
  // ommited code

  render() {
    return html`
      <style>
        button { color: grey; border: none; font-size: 32px; }
        button.selected { color: gold; }
      </style>
      ${[1, 2, 3, 4, 5].map(index => html`
        <button
          className="${index <= this.rate ? ' selected' : ''}"
          onclick=${this.handleStarClick(index)}>★</button>
      `)}
    `;
  }
}
```

Note that we also define that the `handleStarClick` method will be called every time a star is clicked, so that we can also react to user interaction.

Just like happens in [React](https://medium.freecodecamp.org/react-binding-patterns-5-approaches-for-handling-this-92c651b5af56), we have to bind `this` to `handleStarClick` in the constructor.

```javascript
class StarRating extends SlingElement {
  constructor() {
    super();
    this.rate = 0;
    this.handleStarClick = this.handleStarClick.bind(this);
  }

  // ommited code

  handleStarClick(index) {
    return () => {
      this.rate = index;
    };
  }
}
```

### Dispatching events

At this point, the component is working as expected, but the application is not aware of what's happening inside of it. To work this out, we dispatch custom DOM events that can be observed by the application. SlingElement implements a method called `dispatchEventAndMethod` that does that.

```javascript
class StarRating extends SlingElement {
  // ommited code

  static get properties() {
    return {
      rate: {
        type: Number,
        reflectToAttribute: true,
        observer(newRate, oldValue) {
          this.restrictRate(newRate);
          this.dispatchEventAndMethod('rate', newRate);
        },
      },
    };
  }
```

Note that the `observer` key was changed to accept a method instead of a string. The result is the same: when the `rate` property changes, the `observer` method will be called receiving the current property value and the old one.

At this point, at the application, it is be possible to listen for the `rate` event an implement the `onrate` method, like this:

```javascript
document.addEventListener('rate', evt => { console.log(evt.detail) });
```

```javascript
const starRatingElement = document.querySelector('star-rating');
starRatingElement.onrate = evt => { console.log(evt.detail) };
```

### Complete example

That's it. We have finished the Star Rating component. Here's the complete code:

```javascript
import { SlingElement, html } from 'sling-framework';

class StarRating extends SlingElement {
  constructor() {
    super();
    this.rate = 0;
    this.handleStarClick = this.handleStarClick.bind(this);
  }

  static get properties() {
    return {
      rate: {
        type: Number,
        reflectToAttribute: true,
        observer(newRate) {
          this.restrictRate(newRate);
          this.dispatchEventAndMethod('rate', newRate);
        },
      },
    };
  }

  restrictRate(newRate, oldRate) {
    if (Math.round(newRate) !== newRate || newRate < 0 || newRate > 5) {
      this.rate = Math.round(Math.max(0, Math.min(5, newRate)));
    }
  }

  handleStarClick(index) {
    return () => {
      this.rate = index;
    };
  }

  render() {
    return html`
      <style>
        button { color: grey; border: none; font-size: 32px; }
        button.selected { color: gold; }
      </style>
      ${[1, 2, 3, 4, 5].map(index => html`
        <button
          className="${index <= this.rate ? ' selected' : ''}"
          onclick=${this.handleStarClick(index)}>★</button>
      `)}
    `;
  }
}

window.customElements.define('star-rating', StarRating);
```

## withRequest

The withRequest decorator enhances any web component with methods, properties and events for handling API requests.

To start using it, first, we install `sling-framework` from npm.

```bash
npm install --save sling-framework
```

Then, we import withRequest in a javascript file.

```javascript
import { withRequest } from 'sling-framework';
```

Being a javasscript decorator, withRequest must wrap the class it enhances like this:

```javascript
import { SlingElement, html, withRequest } from 'sling-framework';

class RandomUsers extends withRequest(SlingElement) {}
```

isLoading
requestErrors

request
requestParamsChangedCallback

requestParamNames

startloading
finishloading
requesterror
requestsuccess

## withSetState

setState