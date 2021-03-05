## !Not ready for production!

# ThemeBuilder
Shopify theme builder using ThemeKit and Webpack

## Installation
```shell
cp example.env .env
cp example.config.yml config.yml
```
### Generating the theme
To start with development you should create a development theme.
Fill in the `.env` file. To generate a store password, make a private app in your shopify store `XX.myshopify.com/admin/apps/private`.

Run this command to generate a new theme:
```shell
npm run new
```

### Starting development
To start development you need to fill in the `config.yml` file. 

To get the theme id, i'd refer to: https://community.shopify.com/c/Shopify-Design/How-do-I-find-my-theme-id-While-setting-up-shopify-theme-gem/td-p/189434

To run the ThemeBuilder use:
```shell
npm run watch
```
