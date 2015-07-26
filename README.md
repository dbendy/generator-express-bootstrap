# generator-express-bootstrap

## Getting started

### Install yeoman and generator

```bash
npm install -g yo
```
```bash
npm install -g git+https://github.com/dbendy/generator-express-bootstrap.git#master
```

### Create new app

```bash
cd ../
```
```bash
mkdir <directory for new app>
```
```bash
cd <directory for new app>
```
```bash
yo express-bootstrap
```
### About your new app
Out of the box, your app comes with:
- `.gitignore` for node.
- `.editorconfig` so that an IDE will implement consistent styling.
- `Eslint`.  Just run `npm run-script lint`.  The rules are a modified copy of those found in the airbnb-style module.
- Shrinkwrapping.  Just run `npm run-script shrinkwrap`.
- Tests.  Just run `npm test`.  The tests are written with `mocha` and `chai`.
- Config module.  All configs that you add to your app should be put in `/config/default.js`.
- `Twitter bootstrap`.  It is already included in the head of `index.html`.
- `Express` with `Nunjucks` as the templating engine.
- `Bunyan` so that all requests are automatically logged.
