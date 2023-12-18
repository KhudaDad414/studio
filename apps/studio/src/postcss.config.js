const purgecss = [
  '@fullhuman/postcss-purgecss',
  {
    // https://purgecss.com/configuration.html#options
    content: ['./src/**/*.tsx', './app/**/*.tsx'],
    css: [],
    whitelistPatternsChildren: [/monaco-editor/], // so it handles .monaco-editor .foo .bar
    defaultExtractor: content => content.match(/[\w-/.:]+(?<!:)/g) || []
  }
];