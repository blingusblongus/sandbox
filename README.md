# Welcome to my sandbox

Learning astro seemed like the perfect opportunity to try out some new things, and maybe throw a site together in the meantime. Here are some of the things I've learned while working with this project:

## Deployment

Deployment is actually pretty easy with Astro and Github Pages - they have an action in beta that works well, with one caveat: **The assets served from the public folder are served at the root path, not the base path.**

This might be the intended behavior, but for gh pages it meant that I needed to prepend the base '/sandbox' to the paths of assets that worked without it in the dev environment. Doing that allows the assets to be fetched in both environments.

