## Getting started

1. In the root folder create an .env file - use .env.template as a reference

2. Run command: `yarn` or if you want to use npm use `npm install`

3. To run it locally enter the next command `yarn dev` or `npm run dev`

4. Visit localhost:3000

## Requests flow

The client side is making requests to NextJS server.

NextJS server then fetches from the bettercommerce API and returns the data

You can observe this by opening network tab, you'll see most of the requests are redirected to hostname/api/REQUEST

If you inspect the request in pages/api/REQUEST you will see that it is calling a different method from the Bettercommerce API

## Folder structure

components - here we define all the components and utils to use in the app. Example of a component: <Button />. A general rule of thumb for components design is to use functional components and make them as encapsulated and small as possible.

framework - In here you will find all the functions used to communicate with the API

pages - This is a special folder used by NextJS. Do not rename this. For every file / folder in page NextJS will create a new page. For example if you put a /hello.tsx in pages, the content will be rendered on hostname/hello

Read more here: https://nextjs.org/docs/basic-features/pages

Public - place all the assets.

Typical flow for creating a new page:

Create a page in `pages`
Create components used for this in `components/componentName`
Make all the requests in pages/api . Create a separate function for each call.
