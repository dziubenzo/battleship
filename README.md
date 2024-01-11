# Webpack Template Repo

**Created**: before starting the Weather App project (9 December 2023)

**Last Updated**: before starting the Battleship project (11 January 2024)

## Installation Steps

1. Run `npm init -y`
2. Run `npm i -D css-loader html-webpack-plugin sass sass-loader style-loader webpack webpack-cli webpack-dev-server webpack-merge`
3. Add to/change in **package.json**:

```
  "description": "",
  "private": true,
  "scripts": {
    "build": "webpack --config webpack.prod.js",
    "dev": "webpack serve --config webpack.dev.js",
    "deploy": "git subtree push --prefix dist origin gh-pages"
  },
```

4. Remove from **package.json**:

```
  "main": "webpack.common.js",
```

5. Run `npm init @eslint/config` and go through the configuration steps

- Choose `To check syntax and find problems` (Prettier will enforce style instead)
- There won't be a question about choosing a popular style guide, never fear!

6. Install **Prettier** like this:

- Run `npm i --D --save-exact prettier && npm i --D eslint-config-prettier && node --eval "fs.writeFileSync('.prettierrc','{}\n')"`

7. Change **.eslintrc.json** to:

```
{
  "ignorePatterns": ["webpack.common.js", "webpack.dev.js", "webpack.prod.js"],
  "extends": ["some-default-eslint-config", "prettier"],
}
```

8. Run `npx eslint-config-prettier src/js/main.js` to get conflicting rules
9. Add to **.prettierrc**:

```
{
  "singleQuote": true
}
```

10. Install Jest: `npm i --D jest`
11. Create a basic configuration file for Jest: `npm init jest@latest`
12. Install Babel for Jest: `npm i --D babel-jest @babel/core @babel/preset-env` (hope this is enough, this needs to be tested in practice)
13. Create **babel.config.js** in the root directory and add the following to it:

```
module.exports = {
  presets: [['@babel/preset-env', {targets: {node: 'current'}}]],
};
```

14. Configure Jest to handle asset files and find them by adding the following to **jest.config.js**

```
module.exports = {
  modulePaths: ['/shared/vendor/modules'],
  moduleFileExtensions: ['js', 'jsx'],
  moduleDirectories: ['node_modules', 'bower_components', 'shared'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/src/js/__mocks__/fileMock.js',
    '\\.(scss|css|less)$': '<rootDir>/src/js/__mocks__/styleMock.js',
    '^react(.*)$': '<rootDir>/vendor/react-master$1',
    '^config$': '<rootDir>/configs/app-config.js',
  },
};
```

15. Add `@babel/preset-env` by running `npm i --D @babel/preset-env`
16. Add the following to `.babelrc`:

```
{
  "presets": ["@babel/preset-env"]
}
```

17. Run `jest --clearCache` if Jest is not working

### Optional

1. Install babel-loader for webpack, more info [here](https://github.com/babel/babel-loader) - this may potentially be required now
2. Install nodemon (to support/replace Quokka)
