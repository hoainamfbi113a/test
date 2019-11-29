[![Moleculer](https://badgen.net/badge/Powered%20by/Moleculer/0e83cd)](https://moleculer.services)

## NPM scripts
- `npm run dev` - Start development mode (load all services locally with hot-reload & REPL)
- `npm run build`- Uses typescript to transpile service to javascript
- `npm start` - Start production mode (set `SERVICES` env variable to load certain services) (previous build needed)
- `npm run cli`: Start a CLI and connect to production. Don't forget to set production namespace with `--ns` argument in script
- `npm run lint` - Run TSLint
- `npm run ci` - Run continuous test mode with watching
- `npm test` - Run tests & generate coverage report
- `npm run dc:up`: Start the stack with Docker Compose
- `npm run dc:down`: Stop the stack with Docker Compose

## VSCode Debug (Note: Workspace root directory maybe different among computers)
```
{
	"version": "0.2.0",
	"configurations": [{
		"type": "node",
		"request": "launch",
		"name": "Debug",
		"program": "${workspaceRoot}/service-core/node_modules/moleculer/bin/moleculer-runner.js",
		"sourceMaps": true,
		"env": {
			"NODE_ENV": "localhost"
		},
		"runtimeArgs": [
			"--nolazy",
			"-r",
			"ts-node/register",
			"-r",
			"tsconfig-paths/register"
		],
		"cwd": "${workspaceRoot}/service-core",
		"args": [
			"--hot",
			"--repl",
			"--config",
			"moleculer.config.ts",
			"services/**/*.service.ts"
		]
	}]
}
 ```
 
 ## Dev environement
 - Run `yarn dev` to start in CLI.
 - Debug with VSCode Debugger & above config (https://git.solazu.net/enterprise/crm/backend-services/service-core#vscode-debug-note-workspace-root-directory-maybe-different-among-computers)
 - If there's any change in `base-service`, please build `base-service` by `yarn build` in `base-service` folder ---> run `yarn update-base-service` in `service-..` folder
 
 ## Docker config
 - Download Docker --> execute script `docker login` login to pull images from docker hub
 - Change environement variable in docker-compose.env
    + Change **DB_HOST** (use IP address (i.e: 192.168.1.57), **DB_USER**, **DB_NAME**, **DB_PORT**
 - Generate ssh key (https://docs.gitlab.com/ee/ssh/) -> copy private key to `~/.ssh/` folder 
 - Run `yarn dc:up` to **start docker** containers (daemon mode, remove -d if running foreground).
 - Run `yarn dc:down` to **stop docker** containers (in daemon mode, Ctrl + C if running foreground).