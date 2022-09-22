# Custom Components in the Now Experience UI Framework Part 3: UI Builder Properties and Deployment

In the previous articles in this series, we've configured everything within our component code, and used ServiceNow REST API to fetch external data. However, the true power of UI Builder is the ability for developers to use and configure these components in the low-code UI Builder environment. To allow UI Builder users to customize the appearance/capabilities of our custom components, we have to provide them with an API for adjusting specific **properties** of our component. To do so, we'll adjust our `createCustomElement` config to include some default properties, reference these properties in the view, and finally map them to inputs that will appear on the UI Builder sidebar, when our component is used on a UIB page.

## Configuring Default Properties

To start, we'll configure the properties and their default values within the createCustomElement config object. The `properties` key of our config object will reference an object with the variables we want to pass into our component, and their default values. Since `properties` and `initialState` serve similar functions (declaring watched variables that will trigger a rerender when changed) I like to group these next to each other. Right now, our component is set up to query only the 'incident' table, with specific, hardcoded parameters. These should be configurable by our UIB developer, so we'll declare all of these in the `properties` object. For this example, we'll allow the end-user to adjust the query, but will allow the UIB developer to configure the default query, the target table, and the number of results displayed.

<img src="images/Properties_1.png" alt="properties object, defined after initialState in our createCustomElement config object" />

> Notice that we declared a new `initialQuery` instead of moving or reusing the `query` in our `initialState`. We want our `query` to be managed in state by the end user - `initialQuery` will only be used when bootstrapping the component, and will be managed only by the UIB developer, so we'll keep it separate from `query` stored in the component state.

Now that we've established our properties and their defaults, we'll use add them where necessary in our `view` and `actionHandlers`. These are used in our 'FETCH_TABLE' actions, which are sent in the `[COMPONENT_BOOTSTRAPPED]` action handler:

<img src="images/Properties_2.png" alt="[COMPONENT_BOOTSTRAPPED] action handler, with sysparm_limit and table_name set via properties." />

and in the on-click of our 'Fetch Result' button on the DOM: 

<img src="images/Properties_3.png" alt="Our view component, with table and limit destructured from state.payload and included in the on-click action payload for the 'Fetch Results' button." />

It's important to note that the component properties are accessed in different ways, depending on context - in the `view`, they're read with `state.properties`, while in the action handlers, they're destructured from `coeffects`, just like our dispatch helper. 

Upon refreshing the page, our component works the same - but our REST calls now use the default values we set as properties. 

## Configuring the UI Builder Config Panel

There's one more step we need to take to allow our UIB developer to access and configure these properties from the UIB interface.

The `now-ui.json` file lists the components in our workspace, and allows us to map our component properties to fields in the UIB sidebar, as well as edit the details of the component as it appears in UIB.

By default, our component configuration consists of just two options: 

- `"innerComponents"` - Necessary when using other servicenow components within custom component (doesn't apply to us yet)
- `"uiBuilder"` - Defines how the component appears within UI builder. It's helpful to set the `"label"` and `"description"` right off the bat, so that you can find your component easily when testing it in an instance.

We'll add one more, `"properties"`, and include an array describing the fields we want to appear in the 'Config' menu of the UIB sidebar. Most importantly, the `"name"` here must correspond exactly to the name of our property as defined in the `createCustomElement` config.

<img src="images/Properties_4.png" alt="The entire now-ui.json file, with properties added" />

>Note: For the limit property in the example above, we assigned a fieldType of "number", but a default value of a string. The fieldType will constrain the UIB dev to use numbers in that field, but they will still be cast to strings, and entering a non-string as the default value in the `now-ui.json` will generate a non-breaking deployment error.

This allows developers working in UI Builder to adjust the very properties we're using in our code! Consider your properties carefully - to make a streamlined and consistend experience for the UIB developer, I recommend only exposing the properties for variables that are absolutely necessary to customize your component as intended, and also to stick with primitive types for inputs that you expect to be hardcoded by the UIB developer, as handwriting or editing JSON objects can get complex and tiresome.

If you know that the property will be populated by a data broker or client state parameter, you have a little more flexibility, as the UIB dev only needs to insert a variable instead of an entire JSON object.

Similarly, if you're already relying on using async APIs within your component, you can simplify the configuration process for the UIB dev by using their input to fetch more data, but usually you'll want to avoid this as it can add to the amount of time it takes to fully load the content.

## Deployment

To test these properties and ensure they're mapped correctly, we'll need to actually deploy our component to a test instance.

If you ran the deployment command when [setting up the environment](https://creator-dna.com/blog/macos-setup), you'll need to overwrite the files you generated earlier by adding the '--force' flag:

```
snc ui-component deploy --force
```

If this is your first deployment, ensure that the CLI tools are configured correctly with `snc configure profile list`. To deploy with the default profile, simply run `snc ui-component deploy`. If you're using a non-default profile to deploy to an instance other than your default instance, you'll need to add `--profile <profile-name>` to the previous command.

On a successful deployment, I've noticed that refreshing UI Builder is not enough to load the new component, so I always close the browser tab completely, then navigating back to my instance and opening UI Builder. In any UIB Experience, our component should now be searchable in the 'Add Component' list by the name we defined in the `now-ui.json` file (or 'My Component' if we never changed it).

After adding the custom component to the Experience, we should see it appear in the content pane. Clicking the 'Config' tab on the right-hand sidebar will reveal the properties we exposed, and allow us to change their values.

>The results of our property changes will usually show up immediately in the content pane, as soon as the input box loses focus - unless they rely on an async call to update, in which case the component must be saved to view the result. Our three properties all refer to parameters of the REST API call, so we won't see the changes until we save.

You can also click the 'Open' button in the UIB url bar to open the experience in another page, and test it out. If you change the table to something else, you'll only be able to access it if your logged-in or impersonated user has the ACLs to read from that table.

## Conclusion

Our component now has various levels at which its behavior can be adjusted: the end user can adjust what they see through the interactions provided to them on the DOM, the UIB dev can alter the properties we expose to them to configure the appearance, default values, or anything that we allow them to edit, and we can always adjust the code and redeploy to expand functionality or target specific behaviors, inner layouts, and styles if a fundamental change or feature is requested that we want to push out.

When it comes to retrieving, displaying, and even updating data, these basic tools will get us pretty far. But there's still much more available to us! Coming up, we'll be discussing the creation and registration of custom events that can trigger and pass data to handlers beyond the scope of our function; as well as exploring the options for styling our components. 
