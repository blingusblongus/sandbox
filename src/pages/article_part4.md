# Custom Components in the Now Experience UI Framework Part 4: Defining Custom Events

So far in this series, we've scaffolded a new custom component, defined a view for that component by writing some jsx, and given our end-users and UI Builder developers the ability to manage state and/or properties to trigger changes in the UI as well as API requests. We've also defined action handlers and dispatched actions to organize the flow of data within our component.

However, imagine we want our component to trigger one of the many page actions that UIB provides - like redirecting to another page, for instance. UIB has a fairly robust system for mapping and handling events, but to get our events to show up in the UIB UI, there's a little bit of extra configuration to be done.

**At this point, it appears that some aspects of action registration using the CLI are not working as intended**. Ideally, actions can be defined in the `now-ui.json` file, and will be added to the appropriate system tables on deployment. However, we haven't been able to figure out, and have heard that other developers are having the same issue. In this article, we'll describe both the suggested patten that will hopefully work in the near future, as well as the workaround that we're using to circumvent the apparent CLI bug. That said, if you know how to make it work, please let us know!

## Overview and Vocab

Since we'll be peeking behind the scenes a bit to make sure that our events end up registered in the right tables and referenced in the right records, it'll be helpful to go over some of the tables and vocabulary we'll be using later. There are a two broad steps involved in creating a new event and hooking up the right wires to make that event appear in the UIB UI.

1. Create an action and emit it from our component.
2. Configure our **macroponent** to include that dispatched action.



## Setting up our Custom Event

In our example custom component, we fetch data from the ServiceNow REST API and render it in a simple list. An extremely common interaction with a list or table of information would be a 'row clicked' event, that does something with the data from a single item in our list.

To add this functionality to our component, we need to create a new action that will contain the information we want to pass on. Thankfully, we can to this really easily in jsx by adding an `on-click` with a dispatched action when we map over our `list`:

<img src="images/Custom-Actions_1.png" alt="When mapping over our list array, we add an on-click to the div, with an anonymous function dispatching an action with a payload including the individual record from the list." />

> The naming convention used by Service Now for this kind of action is all SCREAMING_SNAKE case, in the format COMPONENT_NAME#EVENT_DESCRIPTOR.

Just for development purposes, let's do some logging with an event handler. Like before, we can destructure `{action}` from the supplied `coeffects`, and use it to log the payload:

```
actionHandlers: {
    ...
    'REST_EXAMPLE#ROW_CLICKED': ({action}) => console.log(action.payload),
}
```

With our development server spun up, clicking one of our rendered list items in the browser will log the payload (containing the record data in object format).

> If you were to log the action itself, you'd find that there's a bunch of additional information that gets added to it. Most of the time though, we're primarily concerned with the payload.

Our component is now emitting our custom action - but we still need to do some work to let UIB know to look for it, and to allow our UIB dev to easily access the data in the payload without scripting.

## Configuring actions in `now-ui.json`

The [Action Config](https://developer.servicenow.com/dev.do#!/reference/now-experience/sandiego/ui-framework/main-concepts/action-config) developer docs have a section where they describe how actions should be included in the `now-ui.json`, with the action name and a description:

```
"actions": [
				{
					"name": "REST_EXAMPLE#ROW_CLICKED",
					"description": "Contains record data, fired when a single item from the Rest Example Component is clicked"
				}
			],
```

With this added to the `now-ui.json` file, running `snc ui-component deploy --force` will update the `sys_ux_lib_component_action` table with our action - but we're not clear at the moment how that table is used. It does not (at time of writing) include our actions in the dispatched actions for our macroponent. 

## Our Workaround

Until actions can be automatically added through the `now-ui.json` configuration, we'll need to take a couple of extra steps on first and subsequent deployments. We found that, although the `now-ui.json` configuration will add records to the `sys_ux_lib_component_action` table, the table containing the references for the macroponent's **Dispatched Events** is actually `sys_ux_event`.

The **Dispatched Events** of our macroponent control the events that show up in the sidebar when our component is selected in UIB, so we'll need to manually add a record to `sys_ux_event` the first time we deploy. 

