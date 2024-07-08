# CycloneDX BOM

[![shield_npm-version]][link_npm]
[![shield_gh-workflow-test]][link_gh-workflow-test]
[![shield_license]][license_file]  
[![shield_website]][link_website]
[![shield_slack]][link_slack]
[![shield_groups]][link_discussion]
[![shield_twitter-follow]][link_twitter]

----

This is a so-called **meta-package**, it does not ship any own functionality, but it is a collection of optional dependencies.
This package's dependencies are tools* with one purpose in common:  
generate _[CycloneDX][link_website]_ Software-Bill-of-Materials (SBOM) from _node_-based projects.

| ecosystem | actual tool |
|:---------:|:------------|
| _npm_ | [@cyclonedx/cyclonedx-npm](https://www.npmjs.com/package/%40cyclonedx/cyclonedx-npm) |
| _pnpm_ | To be announced, suggestions welcome. <br/> Candidate: [cyclonedx-node-pnpm](https://github.com/CycloneDX/cyclonedx-node-pnpm) |
| _yarn_ | [@cyclonedx/yarn-plugin-cyclonedx](https://www.npmjs.com/package/%40cyclonedx/yarn-plugin-cyclonedx) |

*) You should not depend on this very meta-package, instead depend on the actual tool that fits your specific (eco)system.

## Out of Scope

There are systems, that are not node-targeting, but use node as a runtime/compiler environment, or use node package registry as a distribution system.
These systems are out of scope. Therefore, the following tools are not part of this very meta-package.

| system | actual tool(s) |
|:------:|:---------------|
| _Angular_ | [@cyclonedx/webpack-plugin with _Angular_](https://www.npmjs.com/package/%40cyclonedx/webpack-plugin?activeTab=readme#user-content-use-with-angular) |
| _Bower_ | None. (_Bower_ is [deprecated](https://bower.io/blog/2017/how-to-migrate-away-from-bower/)!) |
| _esbuild_ | To be announced, suggestions welcome. <br/> Candidate: [cyclonedx-esbuild-plugin](https://github.com/CycloneDX/cyclonedx-esbuild-plugin) |
| _Parcel_ | To be announced, suggestions welcome |
| _React_ | [@cyclonedx/webpack-plugin with _React_](https://www.npmjs.com/package/%40cyclonedx/webpack-plugin?activeTab=readme#user-content-use-with-react) |
| _Rollup_ | [rollup-plugin-sbom](https://www.npmjs.com/package/rollup-plugin-sbom?activeTab=readme) |
| _Rspack_/_Rsbuild_ | To be announced, suggestions welcome |
| _Svelte_ | To be announced, suggestions welcome |
| _Vite_ | [rollup-plugin-sbom with _Vite_](https://www.npmjs.com/package/rollup-plugin-sbom?activeTab=readme#usage-with-vite) |
| _webpack_ | [@cyclonedx/webpack-plugin](https://www.npmjs.com/package/%40cyclonedx/webpack-plugin) |

## Library

If you are looking for a JavaScript/TypeScript library for working with CycloneDX, its data models or serialization,
then you might want to try [@cyclonedx/cyclonedx-library](https://www.npmjs.com/package/%40cyclonedx/cyclonedx-library).

## Contributing

You want to have a certain node-based tool added?  
Feel free to open issues, bugreports or pull requests.  
See the [CONTRIBUTING][contributing_file] file for details.

## Copyright & License

CycloneDX Node Module is Copyright (c) OWASP Foundation. All Rights Reserved.

Permission to modify and redistribute is granted under the terms of the Apache 2.0 license.  
See the [LICENSE][license_file] file for the full license.

----

## Previous versions

This project used to be a tool-set and a library to work and generate [CycloneDX][link_website] Software Bill-of-Materials (SBOM) from _npm_ and _yarn_ based projects.  
Since version 4.0, this was all split to individual projects, and this project changed to a bare meta-package.

Previous versions of this very package are still available
via [npmjs versions](https://www.npmjs.com/package/@cyclonedx/bom?activeTab=versions)
and [github releases](https://github.com/CycloneDX/cyclonedx-node-module/releases)

[license_file]: https://github.com/CycloneDX/cyclonedx-node-module/blob/master/LICENSE
[contributing_file]: https://github.com/CycloneDX/cyclonedx-node-module/blob/master/CONTRIBUTING.md

[shield_gh-workflow-test]: https://img.shields.io/github/actions/workflow/status/CycloneDX/cyclonedx-node-module/nodejs.yml?branch=master&logo=GitHub&logoColor=white "build"
[shield_npm-version]: https://img.shields.io/npm/v/%40cyclonedx%2fbom/latest?label=npm&logo=npm&logoColor=white "npm"
[shield_docker-version]: https://img.shields.io/docker/v/cyclonedx/cyclonedx-node?logo=docker&logoColor=white&label=docker "docker"
[shield_license]: https://img.shields.io/badge/license-Apache%202.0-brightgreen.svg?logo=open%20source%20initiative&logoColor=white "license"
[shield_website]: https://img.shields.io/badge/https://-cyclonedx.org-blue.svg "homepage"
[shield_slack]: https://img.shields.io/badge/slack-join-blue?logo=Slack&logoColor=white "slack join"
[shield_groups]: https://img.shields.io/badge/discussion-groups.io-blue.svg "groups discussion"
[shield_twitter-follow]: https://img.shields.io/badge/Twitter-follow-blue?logo=Twitter&logoColor=white "twitter follow"
[link_gh-workflow-test]: https://github.com/CycloneDX/cyclonedx-node-module/actions/workflows/nodejs.yml?query=branch%3Amaster
[link_npm]: https://www.npmjs.com/package/%40cyclonedx/bom
[link_docker]: https://hub.docker.com/r/cyclonedx/cyclonedx-node
[link_website]: https://cyclonedx.org/
[link_slack]: https://cyclonedx.org/slack/invite
[link_discussion]: https://groups.io/g/CycloneDX
[link_twitter]: https://twitter.com/CycloneDX_Spec
