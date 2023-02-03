## This is a desktop app which is creating for fun

### How to use in development

You should run all those npm scripts in parallel to watch the app
```bash

yarn run frontend:server # sometime live-server reload may have problem, just restart it

yarn run frontend:typescript

yarn run frontend:watch

yarn run tauri:dev

# optional
yarn run react-devtools
```

### How to deploy app
```bash
tauri build
```

