module.exports = {
  "extends": "airbnb-base",
  "plugins": [
    "import"
  ],
  rules: {
    'class-methods-use-this': ["error", {"exceptMethods": ['render', 'style', 'events']}]
  }
};