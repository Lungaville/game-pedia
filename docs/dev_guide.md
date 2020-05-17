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

3. Create database

```
mysql -u 'root' -p
```

```

create database db_soa;
commit;
exit;
```

4. Done

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

## Sequalize Guide

### Fix "'sequelize' is not recognized as an internal or external command"

Replace `sequelize` with `npx sequelize`, example :

```
sequelize --version
```

```
npx sequelize --version
```

### Generate Model/Migration

```bash
sequelize model:create --name users --attributes name:string,email:string,phone_number:string,gender:boolean
```

### Migrate DB

```bash
sequelize db:migrate
```
