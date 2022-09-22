---
layout: ../layouts/MarkdownLayout.astro
title: Hello
---

# Custom Components in the Now Experience UI Framework Part 2: Actions and Action Handlers

In the last article, we walked through the process of initializing a custom component with ServiceNow ui-component cli tool, gave a brief overview of the boilerplate files and their function, and built a simple stateful component that tracks user input, and displays the information stored in the component state.

In this article, we'll set up our component to call the ServiceNow REST API with parameters input by the user, store the response in state, and render the result.

## Actions Handlers and Effects

Though you can add a call to the REST API by any of the usual means of doing so, it's best to put our REST call in an Action Handler, along with the rest of our effectful code.

**Actions** in Now Experience operate somewhat similar to the actions you'd find in something Like Redux, with some key distinctions. Actions can be dispatched from our components via user interaction or by hooking into the **lifecycle** of the component. These actions are captured by the **action handlers** that we'll define within the `createCustomElement` function.

Actions and Action Handlers help us to organize our code to reflect the **lifecycle** of the component. Now Experience components rely on unidirectional data flow to update consistently and predictably. In a Now experience component, the flow of data typically looks like this:

```
Component Rendered => Action Triggered => State Updated => Component Rendered
```

So let's write a basic action that we can dispatch via user interaction. We're going to refactor the `on-change` function of our input element to send an action instead of updating state directly. We'll begin by including `{dispatch}` in our view props (it's passed as a prop by `createCustomElement`), and then replacing our on-change function with `(e) => dispatch('SET_NAME', {name: e.target.value})`.

<img src="images/Action_Handlers_2.png" alt="Our updated view component, using the dispatch prop and attaching it to the on-change event listener"/>

Every time our input's on-change function fires, it will dispatch an action that bubbles up through the DOM. Each action includes a string `type`(good practice is to use SCREAMING_SNAKE case) used to match the action to the appropriate handler, and a payload containing the data we want to pass, usually in the form of an object. Our example action has the type 'SET_NAME', and an object payload with a single key/value pair for now.

We haven't yet set up a handler to catch that action, though - we can test that our action is being dispatched by adding a handler that will print the payload of that action to the console. To do so, we'll create a property `actionHandlers` in the `createCustomElement` config object. The keys of our actionHandlers object will correspond to the `type` of the action we want to catch, and the values will consist of a function that we want to run when the corresponding action is received. To make sure our action is being dispatched properly, we'll start with a simple `console.log`.

<img src="images/Action_Handlers_3.png" alt="The createCustomElement config object, with a single action handler added"/>

One thing you may have noticed is that we had to destructure `{action}` to pass it to the arrow function that comprises the action handler. That's because the action handler actually is passed a number of **coeffects**, including **state**, **updateState**, our **action**, and other useful things. This makes it easy to manage state by destructuring `{updateState}` and passing it the `action.payload`.

```
{
SET_NAME: ({action, updateState}) => updateState(action.payload)
}
```

Since we set our payload to be an object with a key/value corresponding to a key/value set with `initialState`, we can pass it directly to `updateState` without needing to massage it. If we return to the browser, we'll see that our simple refactor is complete - changing the content of the input element dispatches an action, which is picked up by our action handler and used to update the state.

## Built in Lifecycle Actions

We've learned how to handle custom actions dispatched from our component or its subcomponents, but there's even more we can do with our action handlers. Components instantiated with `createCustomElement` also automatically dispatch a number of built-in actions that we can tap into by referencing the appropriate action types.

To do this, at the top of the file, we'll include `actionTypes` as an import from `@servicenow/ui-core`:

```
import { createCustomElement, actionTypes } from '@servicenow/ui-core';
```

Then, we can use object destructuring once again to grab a reference to the action type we want, in this case, `COMPONENT_BOOTSTRAPPED`. We'll add this line outside of our component, after the imports:

```
const { COMPONENT_BOOTSTRAPPED } = actionTypes;
```

and add it to our `actionHandlers` object:

```
[COMPONENT_BOOTSTRAPPED]: () => console.log('component loaded'),
```

Since this action type is a variable, we have to use square brackets when including it as a key in our `actionHandlers` configuration. The `COMPONENT_BOOTSTRAPPED` action is dispatched only once, when the component is mounted, and its handler is a very handy place to put code that we only want to fire once (like fetching the resources from an external source that we'll use to initialize our component, for example). Check out the [Component Lifecycle Action Handlers](https://developer.servicenow.com/dev.do#!/reference/now-experience/quebec/ui-framework/main-concepts/lifecycles) article of the ServiceNow docs to get a glimpse of the other lifecycle actions available (there's some neat stuff in there - some of these actions automatically have extra stuff in the payload, `previousRenderProperties` and `previousRenderState`)!

> For those familiar with React hooks, you can use the `COMPONENT_BOOTSTRAPPED` action similar to how you might use the `useEffect()` hook with empty brackets as the second parameter to do an initial fetch for a component.

## Communicating with the ServiceNow REST API

We're almost ready to fetch some data from our instance - we'll want to fetch some data as soon as our component mounts, but we might want to reuse that effect later, too...so we'll expand our `[COMPONENT_BOOTSTRAPPED]` action handler to dispatch an action with the type `'FETCH_TABLE'`, and put our REST call in another action handler, so that we can trigger it programmatically from different places in our code.

<img src="images/Action_Handlers_4.png" alt="The actionHandlers object configured with basic 'SET_NAME', [COMPONENT_BOOTSTRAPPED], and 'FETCH_TABLE' handlers."/>

> Note that actions always need types, but not necessarily payloads (we will end up adding a payload in a bit, though).

Here's where ServiceNow provides a tool to help standardize our effects - though you can do a REST call in an action handler by any means you normally would, in this case we'll `import {createHttpEffect} from '@servicenow/ui-effect-http';` at the top of our file, add it to our 'FETCH_TABLE' action handler, and configure it according to the [Http Effect API Docs](https://developer.servicenow.com/dev.do#!/reference/now-experience/sandiego/ui-framework/api-reference/effect-http). 

<img src="images/Action_Handlers_5.png" alt="Our 'FETCH_TABLE' handler, configured to accept a payload with path and query params and consume the ServiceNow REST API."/>

Looking at the handler we just created, you can see that the `createHttpEffect` function accepts two parameters - the API endpoint and an object with configuration options. Here, we've defined the request method ('GET'), the pathParams noted in the url with `':table_name'`, the query parameters we want to include, and the types of the actions that will be dispatched when the promise resolves.

At this point, dispatching an action with the type `FETCH_TABLE` and a payload object with key/value pairs representing the path and query parameters will create an HttpEffect with our REST request, and will send the returned data as the payload along with either our successActionType or errorActionType. Let's try it, by adding the following object to our `FETCH_TABLE` action in the `COMPONENT_BOOTSTRAPPED` action handler:

```
{
    table_name: 'incident', 
    sysparm_limit: 10, 
    sysparm_query: 'active=true'
}
```

> If the console here is logging a 404 error, run `snc configure profile set` and input the relevant data for your instance to ensure that the proxy is configured correctly. When I ran into a proxying error, I terminated my node process, ran `killall node` for good measure, confirmed my CLI configuration with `snc configure profile set`, and then ran `snc ui-component develop` twice to get it up and running on port 8081.

Now, on page refresh, we should have a 'Success!' log in the console informing us that the `FETCH_TABLE_SUCCESS` action was dispatched, and have a result object containing an array with the matched records printed in the console as well. We've successfully created a custom component that can fetch data from our ServiceNow instance! Most excellent.

<img src="images/Action_Handlers_6.png" alt="Console logs of the result of the REST API call."/>

## Updating our Component

The data's still not on the DOM yet, though - but if we store it in our component state, we can access that data from the view and automatically rerender the component when the fetch completes and state changes. In the `createCustomElement` config, we'll add `initialState.list`:

```
initialState: {
    name: 'ServiceNow User',
    list: [],
},
```

and update the `FETCH_TABLE_SUCCESS` handler to destructure `updateState` from `coeffects`, using it to set the list...

<img src="images/Action_Handlers_7.png" alt="Destructuring updateState from coeffects, and setting the new value of state.list to action.payload.result"/>

If you're new to React and have kept the logs we placed earlier, putting a `console.log(state)` right before the return of our View component will give us a nice overview of the lifecycle of the component:

<img src="images/Action_Handlers_8.png" alt="Console.logs showing the lifecycle of the component."/>

1. The component is bootstrapped (renders for the first time). At this point, `state.list` = []
2. A series of actions is kicked off: `COMPONENT_BOOTSTRAPPED` => `FETCH_TABLE` => `FETCH_TABLE_SUCCESS`
3. The `FETCH_TABLE_SUCCESS` handler updates the state of our component with `updateState()`
4. Because the state was updated, our component rerenders - this time, with `state.list` as *Array(10)*, or whatever records were returned from the ServiceNow REST API.

In later articles, we'll do more styling, but for now, let's just slap it on the DOM. In the view component, we'll destructure `state.list`, and then evaluate code in the return statement to map through it and render a simple `<div>` for each record in that list. By destructuring the record as well, we can grab the `number`, `short_description`, and any other info we want to use from that record.

<img src="images/Action_Handlers_9.png" alt="The code for the view component, updated to map through and display the elements in state.list"/>

> I've included the 'key' prop here just to be safe - in React, the key prop has to be a distinct value, and is used to differentiate elements that are programmatically generated at the same level, in order to track them in the virtual DOM.

## Handling User Input

Our component's doing what it's supposed to, but it'd be great if it was a bit more flexible. As a quick example, we'll allow a user to determine the exact query we'll use when retrieving results from our ServiceNow instance. To do so, we'll need to do the following:

1. Initialize state with a 'query' property
2. Set up an input to track and update that property
3. Add a button to initiate the fetch.
4. Define actions and action handlers to handle the `state.query` updates and button click.

First, we update our config in `createCustomElement` to store the query:
```
initialState: {
    name: 'ServiceNow User',
    list: [],
    query: '',
},
```

Then, we add elements to the view to handle user input: 

<img src="images/Action_Handlers_10.png" alt="An input, label, and button to dispatch actions in response to user interaction."/>

Finally, we add the new `SET_QUERY` action handler:

```
actionHandlers: {
    ...
    'SET_QUERY': ({action, updateState}) => updateState(action.payload),
    ...
}
```

And that's all it takes! Since we set up our `FETCH_TABLE` action handler to accept params passed with an action payload, all we need to do is dispatch the appropriate actions to update the query when the input field changes, and to trigger our HttpEffect with the current value of `state.query` when the button is pressed.

<img src="images/Action_Handlers_11.png" alt="The component displaying results based on user input"/>

That's all for this one - in the next articles, we'll look at configuring our component to accept variable properties passed in through the UI Builder Interface, styling components, refactoring and organizing components and subcomponents, and integrating existing ServiceNow components.