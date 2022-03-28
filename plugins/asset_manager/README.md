# Asset Manager

A Kibana plugin

---

## Development

See the [kibana contributing guide](https://github.com/elastic/kibana/blob/main/CONTRIBUTING.md) for instructions setting up your development environment.

## Scripts

<dl>
  <dt><code>yarn kbn bootstrap</code></dt>
  <dd>Execute this to install node_modules and setup the dependencies in your plugin and in Kibana</dd>

  <dt><code>yarn plugin-helpers build</code></dt>
  <dd>Execute this to create a distributable version of this plugin that can be installed in Kibana</dd>
</dl>

## Build Plugin
rm -rf /kibana-dev/plugins/asset_manager/build/*
cd /kibana-dev/plugins/asset_manager; 
yarn build --kibana-version #{elk_version}"


## Install Plugin
cd /usr/share/kibana; bin/kibana-plugin remove assetManager
cd /usr/share/kibana; bin/kibana-plugin install file:///assetManager-8.1.0.zip
