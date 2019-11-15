[![Moleculer](https://badgen.net/badge/Powered%20by/Moleculer/0e83cd)](https://moleculer.services)

# moleculer-demo-ts
npm install typeorm -g

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