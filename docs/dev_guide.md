# Development guide

## First time

1. Clone repository

```
https://gitlab.com/ilos-vigil/nodejs-game-restful-api.git
```

2. Install library

```
cd nodejs-game-restful-api
npm install
```

3. Done

## Use nodemon to debug on VSCode automatically

> https://stackoverflow.com/questions/34450175/can-visual-studio-code-be-configured-to-launch-with-nodemon

1. Open launch.json
2. Change it to

```json
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "nodemon",
            "runtimeExecutable": "${workspaceFolder}/node_modules/nodemon/bin/nodemon.js",
            "program": "${workspaceFolder}/app.js",
            "restart": true,
            "console": "integratedTerminal",
            "internalConsoleOptions": "neverOpen"
        }
    ]
}
```
