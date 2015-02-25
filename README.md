platform-ui
===========

Platform Skin

# How to create your own skin add-on

A good example is available here: https://github.com/exo-addons/dark-skin/tree/develop

1. Fork this repo https://github.com/exodev/platform-ui.git
1. Change the default name "eXoSkin" to the name of your skin add-on (for instance "myCustomExoSkin") for:
  - `<platform-ui-skin-final-name>` in `platform-ui/pom.xml`
  - `<display-name>` in `platform-ui/platform-ui-skin/src/main/webapp/WEB-INF/web.xml`
  - `@images-path:` in `platform-ui/platform-ui-skin/src/main/webapp/skin/less/variables.less`
  - `<string>` in `platform-ui/config/src/main/resources/conf/configuration.xml`
1. Optional: Modify the `group-id` and the `version` of the pom
1. Modify the less variable in `platform-ui/platform-ui-skin/src/main/webapp/skin/less/variables.less`
1. Optional: if you want to use a different set of icon color you need to modify the `<packagingExcludes>` in `platform-ui/platform-ui-skin/pom.xml` to remove the set you want to use and update the `@images-path:` in `platform-ui/platform-ui-skin/src/main/webapp/skin/less/variables.less` (for instance `@images-path: "/myCustomExoSkin/skin/images/themes/red";`)
1. Compile your project
  <grep><code>$ mvn clean install</code></grep>
1. Create a `local.json` with content below in `[eXo Platform server]/addons/` to be able to install your add-on using the add-on manager:
```
  [
  {"id": "myCustomExoSkin",
  "version": "1.0.x-SNAPSHOT",
  "name": "eXo Skin Add-on",
  "description": "The eXo Skin Add-on",
  "downloadUrl": "file://[path to your add-on]/exo-skin-addon.zip",
  "vendor": "eXo platform",
  "license": "LGPLv3",
  "supportedDistributions": ["community","enterprise"],
  "supportedApplicationServers": ["tomcat","jboss"]},
  "compatibility": "[4.2.0-M1,)"
  ]
```

1. Install your add-on <grep><code>$ ./addon install myCustomExoSkin --snapshots</code></grep>
1. Uninstall your add-on <grep><code>$ ./addon uninstall myCustomExoSkin</code></grep>