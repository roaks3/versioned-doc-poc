# Versioned Doc Proof-of-Concept

A work-in-progress project intended to demonstrate the core concepts of the Product Documentation Versioning solution. Currently deployed at https://versioned-doc-poc.vercel.app/docs/stable.

Currently includes:
- NextJS static site generation with fallback behavior, so pages are rendered on-demand once and then cached
- Content in the `content` directory, and versions expressed as git tags
- Urls structured as `/docs/<version>/<path-to-content>`, eg. `/docs/v0.0.1/schedulers`
    - `latest` version uses the local unstaged content (requires `LATEST_ENABLED=true`)
    - `stable` version uses the most recent available version

## Quick Start

```
$ npm install
$ npm run dev
```
