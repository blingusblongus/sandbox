---
layout: ../layouts/MarkdownLayout.astro
title: Hello
---


# Custom Components in the Now Experience UI Framework Part 1: Creating a Stateful Webcomponent

While the Now Experience UI Builder provides a number of built-in components for constructing experiences, you may want to tweak an existing component beyond what's possible in the UI Builder, or even create your own component from scratch. In this series of articles, we'll walk through the process of creating a custom component, setting up action handlers to call the Service Now REST API, and configuring the component to accept custom parameters passed to it through the UI Builder interface.

In this, the first article of the series, we'll be highlighting some of the differences between the snabbdom renderer (used in the Now Experience UI) and ReactDOM renderer, and will initializing a simple stateful component that accepts user input and updates the DOM to reflect that input.

This article assumes you have node, the ServiceNow CLI, and the ui-component CLI extension already installed. If not, check out [this article on setting up the development environment on MacOS](https://creator-dna.com/blog/macos-setup), or [this article for getting started on Windows](https://creator-dna.com/blog/1hj866nlrwslzlesekt0c14grhh8u1).

## Project Initialization and First Look

Once our CLI tools are installed and our dev environment is ready, we can create and navigate to our new project folder by opening a terminal and running:

`mkdir my-project-name && cd my-project-name`

Then, we initialize our project by running the project command along with the `--name` and `--description` flags. You can also provide a scope with the optional `--scope` flag. 

`snc ui-component project --name my-project-name --description "Our Project Description"`

<img src="https://raw.githubusercontent.com/blingusblongus/creator-dna-example-ui-builder-rest-component/main/images/First-Look_1.png" alt="Example of a terminal command to initialize a new ui-component project"/>

> Note: If you don't have internet or access to your instance, you'll have to use the `--offline` flag as well as providing a custom scope with the `--scope` flag.

The ui-component CLI will then create the boilerplate files for the project. If it prompts you to update yo, do so with `npm install -g yo`.

Now that the project's been scaffolded, we're almost ready to take a look at our new component. Run `npm install` to install the project dependencies (this may take a few minutes).

While the dependencies are installing, let's take a look at the files that have been added to the project folder:

The `now-ui.json` is where we configure the details of our new component, including how this component appears and interacts with the UI Builder interface. We'll add more to it later, but for now, the appearance of the component in the UI Builder menus (label, icon, description) can be set in this file.
<img src="https://raw.githubusercontent.com/blingusblongus/creator-dna-example-ui-builder-rest-component/main/images/First-Look_2.png">

The `now-cli.json` contains the config for the CLI. If you have issues proxying your requests from the development environment, this is where to look.

The only top-level file we'll need to edit is the `package.json`. As of time of writing, there's an additional dependency we'll need to install to test our components in the local environment. Adding the line `"react-error-overlay": "6.0.9"` to `devDependencies` (and running the command `npm install`) will prevent a bugged error overlay from blocking interaction with our component in the development environment.

<img src="https://raw.githubusercontent.com/blingusblongus/creator-dna-example-ui-builder-rest-component/main/images/First-Look_5.png" alt="Adding 'react-error-overlay': '6.0.9' to devDependencies" />

`snc ui-component develop` to start the development server. If the process seems to be stuck, ctrl + c and run the same command again. You should get a message confirming that the project is now running at http://localhost:8081/. Navigate to this address and you'll see...

<img src="https://raw.githubusercontent.com/blingusblongus/creator-dna-example-ui-builder-rest-component/main/images/First-Look_6.png" alt="A blank white screen" />

We're looking at our brand new component! There's just nothing in it yet.

If we open the src/ directory, we'll see the files that we'll be editing to create our custom components. The convention used by ServiceNow for organizing component files is to store each component/subcomponent in its own folder, with an index.js as the entrypoint. When we start, we can write code directly in the index.js, but as a component grows more complex, you may want to refactor it into a view.js, actionHandlers.js, etc.

> Note: The compiler that ServiceNow uses to build these components does not recognize .jsx files - use .js instead.

Opening the src/index.js file, we discover the reason for the blank white screen: our component is rendering only an empty div. Type "Hello World!" into the div, and the component will automatically recompile and display in the browser.

At this point, the index.js file contains all the code for our component (aside from any styling rules we may have included in the styles.scss):

<img src="https://raw.githubusercontent.com/blingusblongus/creator-dna-example-ui-builder-rest-component/main/images/First-Look_7.png" alt="The index.js file, with our 'Hello World' text added" />

The createCustomElement function accepts the name of the component as the first argument, and an object containing the rendering options as the second component. When the project is initialized, it contains three properties:

- **renderer**: The render engine to use. ServiceNow recommends not changing this property.
- **view**: The jsx to render. Usually, as in this project, this property references a function that returns jsx.
- **styles**: A stylesheet for the element. In this case, it's the imported styles.scss file.

There are more configuration options, like **state**, **properties**, and **actionHandlers**, which we'll use later on. 

> What's JSX? If you're not familiar with frameworks that use webcomponents (like React), the arrow function on line 5 might look strange to you. JSX is just html that's mixed in with javascript. The view function above is simple - it just spits out whatever html elements we write in the return statement. However, since it's a function, this **component** can be as dynamic as we want it to be - we can change what's returned based on the arguments passed in, and/or further transform or manipulate data in the function body by passing in other components - this is called *composition*.

> There are some quirks to jsx - to avoid reserved javascript words, the html 'class' attribute becomes 'className', and the 'for' attribute becomes 'htmlFor.' Using curly braces {} within jsx marks code that will be evaluated, and is useful for variable interpolation or short-circuiting. Finally, remember that although we can write jsx within our .js files, this particular compiler doesn't recognize the .jsx extension.

## Stateful Components

By adding html (jsx) to the return statement of the view function, we can add content to our component, and style it with the styles.scss page. However, to add interactivity and leverage the performance that comes from using the VirtualDOM, we'll manipulate the state of the component to determine what's rendered.

In the createCustomElement function, we'll add a property to the options object called 'initialState,' and map it to an object with a 'name' key and a corresponding value.

<img src="https://raw.githubusercontent.com/blingusblongus/creator-dna-example-ui-builder-rest-component/main/images/State_1.png" alt="Configuring the initialState of the component">

 initialState sets the default state when the component is mounted. The state can then be accessed from the view component, or any actionHandlers we may add later on.

 To access the current value of 'name', we can use object destructuring or dot notation to store the value in a variable, then use curly braces to evaluate that variable as code in our jsx.

<img src="https://raw.githubusercontent.com/blingusblongus/creator-dna-example-ui-builder-rest-component/main/images/State_2.png" alt="Accessing and interpolating the value of state.name">

Returning to the browser, you should see that the component has updated to display the name that we passed in. 

The neat thing about storing our dynamic values in state is that, when the state of our component changes, only this single component will rerender, without requiring a refresh or rerendering the rest of the components on the page. This makes our app feel snappy and performant, and helps us organize our project by providing components only the data that is relevant to its function.

We can see this in action by adding a controlled input, which will allow our user to interact with the state and see the changes in real time. Let's add a div with a label and text input above our existing div. In addition to the type and name attributes, we'll also set `value={name}`. This will cause an error, since the return jsx of a component must be a single element - so we'll `import { Fragment } from '@servicenow/ui-renderer-snabbdom'` to wrap around our divs. 

<img src="https://raw.githubusercontent.com/blingusblongus/creator-dna-example-ui-builder-rest-component/main/images/State_3.png" alt="Adding an input element">

Once our input element is added and rendering on the page, we can make the input controlled by adding the following on-change attribute and function:

`on-change={(e) => updateState({name: e.target.value})}`

This attribute adds an event listener to the input, which will call the updateState function with the event as an argument when the input value is changed. UpdateState takes a single argument, an object with key/value pairs for the bits of state that we want to change.

<img src="https://raw.githubusercontent.com/blingusblongus/creator-dna-example-ui-builder-rest-component/main/images/State_4.png" alt="adding an on-change event listener to the input element" />

> Note: If you're used to React, you might expect to have to spread state when passing it to the updateState() function. With snabbdomm, however, the updateState() function will only change the values of the properties you provide it, and doesn't require you to create a new object reference manually, so spreading state is not necessary.

Unlike the `onChange` property from React, our `on-change` function will fire only when we press enter or the input loses focus. If you'd like your component to update on every keystroke, use `on-keyup`.

With our on-change handler set up, we can now trigger it by typing in the text field and pressing enter or clicking away. This updates the state of the component, and triggers a rerender that reflects our new component state. Now, our component is truly interactive!

<img src="https://raw.githubusercontent.com/blingusblongus/creator-dna-example-ui-builder-rest-component/main/images/First-Look_8.png" alt="Our component, rendering the updated value of state.name">

In the next article, we'll take it a step further by introducing action handlers and effects, and using them to fetch and display data from a ServiceNow Instance via REST API.

[Part 2: Action Handlers and Effects]()