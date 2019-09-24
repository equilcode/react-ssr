<p align="center">😎 React SSR 😎</p>
<p align="center">React SSR as a view template engine</p>

## How to use

Install it:

```bash
$ npm install --save @react-ssr/express express react react-dom
```

and add a script to your package.json like this:

```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

Populate below files inside your project:

**`./server.js`**

```js
const express = require('@react-ssr/express');
const app = express();

app.get('/', (req, res) => {
  const user = { name: 'World' };
  res.render('index', { user });
});

app.listen(3000, () => {
  console.log('> Ready on http://localhost:3000');
});
```

**`./views/index.jsx`**

```jsx
import React from 'react';

export default function Index({ user }) {
  return `Hello ${user.name}!`;
}
```

and then just run `npm start` and go to `http://localhost:3000`.

You'll see `Hello World!`.

## Features

- Pass server data to the client `props`
- Auto SSR (Server Side Rendering)
- TypeScript support

## Configuration

```js
const express = require('@react-ssr/express');

// default configuration
const app = express({
  distDir: 'dist',
  viewsDir: 'views',
});
```

## TypeScript Support

To enable TypeScript `.tsx`, just put `tsconfig.json` in your project root directory.

And TypeScript codes should be like these:

**`./package.json`**

```json
{
  "scripts": {
    "start": "ts-node server.ts"
  }
}
```

**`./server.ts`**

```ts
import express from '@react-ssr/express';
import { Request, Response } from 'express';

const app = express();

app.get('/', (_req: Request, res: Response) => {
  const user = { name: 'World' };
  res.render('index', { user });
});

app.listen(3000, () => {
  console.log('> Ready on http://localhost:3000');
});
```

**`./views/index.tsx`**

```tsx
import React from 'react';

interface IndexProps {
  user: any;
}

export default function Index({ user }: IndexProps) {
  return `Hello ${user.name}!`;
}
```

## Packages

| package | version |
| --- | --- |
| [@react-ssr/express](https://github.com/saltyshiomix/react-ssr/blob/master/packages/express/README.md) | ![@react-ssr/express](https://img.shields.io/npm/v/@react-ssr/express.svg) ![downloads](https://img.shields.io/npm/dt/@react-ssr/express.svg) |

## Examples

See the [examples](./examples) folder.

## Roadmaps

- [ ] README
  - [x] Roadmaps
  - [x] How to use
  - [ ] Contributing guides
- [ ] develop packages
  - [x] lerna monorepo development
  - [x] @react-ssr/express
    - [x] `.jsx` support
    - [x] `.tsx` support
  - [ ] @react-ssr/fastify
  - [ ] @react-ssr/nest

## Develop `examples/<example-folder-name>`

```bash
$ git clone https://github.com/saltyshiomix/react-ssr.git
$ cd react-ssr
$ yarn
$ yarn dev <example-folder-name>
```

## Articles

[The React View Template Engine for Express](https://dev.to/saltyshiomix/the-react-view-template-engine-for-express-42f0)
