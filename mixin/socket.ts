const IO = require("socket.io");
const _ = require("lodash");
const { match } = require("moleculer").Utils;
const { ServiceNotFoundError } = require("moleculer").Errors;
const { BadRequestError } = require("./errors");
const chalk = require("chalk");

export = {
  name: "io",
  settings: {
    port: 3007,
    server: true,
    io: {
      // options: {}, //socket.io options
      namespaces: {
        "/": {
          authorization: true,
          // middlewares: [],
          // packetMiddlewares:[],
          events: {
            call: {
              // whitelist: [],
              // aliases: {},
              // mappingPolicy: 'all',
              // callOptions:{},
              // onBeforeCall: async function(ctx, socket, args){
              //   ctx.meta.socketid = socket.id
              // },
              // onAfterCall:async function(ctx, socket, data){
              //  socket.emit('afterCall', data)
              // }
            },
          },
        },
      },
    },
  },
  created() {
    const handlers: any = {};
    const namespaces = this.settings.io.namespaces;
    // tslint:disable-next-line: forin
    for (const nsp in namespaces) {
      const item = namespaces[nsp];
      console.debug("Add route:", item);
      if (!handlers[nsp]) {
        handlers[nsp] = {};
      }
      const events = item.events;
      // tslint:disable-next-line: forin
      for (const event in events) {
        const handler = events[event];
        if (typeof handler === "function") {
          // custom handler
          handlers[nsp][event] = handler;
        } else {
          handlers[nsp][event] = makeHandler(this, handler);
        }
      }
    }
    this.settings.io.handlers = handlers;
  },
  started() {
    if (!this.io) {
      this.initSocketIO();
    }
    const namespaces = this.settings.io.namespaces;
    // tslint:disable-next-line: forin
    for (const nsp in namespaces) {
      const item = namespaces[nsp];
      const namespace = this.io.of(nsp);
      if (item.authorization) {
        console.debug(`Add authorization to handler:`, item);
        if (!_.isFunction(this.socketAuthorize)) {
          console.warn(
            "Define 'socketAuthorize' method in the service to enable authorization.",
          );
          item.authorization = false;
        } else {
          // add authorize middleware
          namespace.use(makeAuthorizeMiddleware(this, item));
        }
      }
      if (item.middlewares) {
        // Server middlewares
        for (const middleware of item.middlewares) {
          namespace.use(middleware.bind(this));
        }
      }
      const handlers = this.settings.io.handlers[nsp];
      namespace.on("connection", (socket: any) => {
        socket.$service = this;
        console.info(`(nsp:'${nsp}') Client connected:`, socket.id);
        if (item.packetMiddlewares) {
          // socketmiddlewares
          for (const middleware of item.packetMiddlewares) {
            socket.use(middleware.bind(this));
          }
        }
        // tslint:disable-next-line: forin
        for (const eventName in handlers) {
          socket.on(eventName, handlers[eventName]);
        }
      });
    }
    console.info("Socket.io API Gateway started.");
  },
  stopped() {
    if (this.io) {
      this.io.close();
    }
  },
  actions: {
    call: {
      visibility: "private",
      async handler(ctx: any) {
        let { socket, action, params, handlerItem } = ctx.params;
        // ctx.meta.$join = ctx.params?.params?.join;
        if (!_.isString(action)) {
          console.debug(`BadRequest:action is not string! action:`, action);
          throw new BadRequestError();
        }
        // Handle aliases
        let aliased = false;
        const original = action;
        if (handlerItem.aliases) {
          const alias = handlerItem.aliases[action];
          if (alias) {
            aliased = true;
            action = alias;
          } else if (handlerItem.mappingPolicy === "restrict") {
            throw new ServiceNotFoundError({
              action,
            });
          }
        } else if (handlerItem.mappingPolicy === "restrict") {
          throw new ServiceNotFoundError({
            action,
          });
        }
        // Check whitelist
        if (
          handlerItem.whitelist &&
          !checkWhitelist(action, handlerItem.whitelist)
        ) {
          console.debug(`Service "${action}" not in whitelist`);
          throw new ServiceNotFoundError({
            action,
          });
        }
        // get callOptions
        const opts = _.assign(
          {
            meta: this.socketGetMeta(socket),
          },
          handlerItem.callOptions,
        );

        // Check endpoint visibility
        const endpoint = this.broker.findNextActionEndpoint(action, opts, ctx);
        if (endpoint instanceof Error) {
          throw endpoint;
        }
        if (
          endpoint.action.visibility != null &&
          endpoint.action.visibility != "published"
        ) {
          // Action can't be published
          throw new ServiceNotFoundError({
            action,
          });
        }

        console.debug("Call action:", action, params, opts);
        if (handlerItem.onBeforeCall) {
          await handlerItem.onBeforeCall.call(
            this,
            ctx,
            socket,
            action,
            params,
            opts,
          );
        }
        let res = await ctx.call(action, params, opts);
        if (handlerItem.onAfterCall) {
          res =
            (await handlerItem.onAfterCall.call(this, ctx, socket, res)) || res;
        }
        this.socketSaveMeta(socket, ctx);
        if (ctx.meta.$join) {
          await this.socketJoinRooms(socket, ctx.meta.$join);
        }
        if (ctx.meta.$leave) {
          if (_.isArray(ctx.meta.$leave)) {
            await Promise.all(
              ctx.meta.$leave.map((room: any) =>
                this.socketLeaveRoom(socket, room),
              ),
            );
          } else {
            await this.socketLeaveRoom(socket, ctx.meta.$leave);
          }
        }
        return res;
      },
    },
    broadcast: {
      params: {
        args: {
          optional: true,
          type: "array",
        },
        event: {
          type: "string",
        },
        local: {
          optional: true,
          type: "boolean",
        },
        namespace: {
          optional: true,
          type: "string",
        },
        rooms: {
          items: "string",
          optional: true,
          type: "array",
        },
        volatile: {
          optional: true,
          type: "boolean",
        },
      },
      async handler(ctx: any) {
        console.debug("broadcast: ", ctx.params);
        let namespace = this.io;
        if (ctx.params.namespace) {
          namespace = namespace.of(ctx.params.namespace);
        }
        if (ctx.params.volate) {
          namespace = namespace.volate;
        }
        if (ctx.params.local) {
          namespace = namespace.local;
        }
        if (ctx.params.rooms) {
          for (const room of ctx.params.rooms) {
            namespace = namespace.to(room);
          }
        }
        if (ctx.params.args) {
          namespace.emit(ctx.params.event, ...ctx.params.args);
        } else {
          namespace.emit(ctx.params.event);
        }
      },
    },
    getClients: {
      params: {
        namespace: {
          optional: true,
          type: "string",
        },
        room: "string",
      },
      handler(ctx: any) {
        return new Promise((resolve, reject) => {
          this.io
            .of(ctx.params.namespaces || "/")
            .clients((err: any, clients: any) => {
              resolve(clients);
            });
        });
      },
    },
    sendMessage: {
      params: {
        eventName: "string",
        eventPayload: "object",
        namespace: {
          optional: true,
          type: "string",
        },
        room: "string",
      },
      handler(ctx: any) {
        this.io
          .of(ctx.params.namespaces || "/")
          .to(ctx.params.room || "")
          .emit(ctx.params.eventName, ctx.params.eventPayload);
      },
    },
    get: {
      handler(ctx: any) {
        return ctx.meta.$rooms;
      },
    },
    join: {
      handler(ctx: any) {
        ctx.meta.$join = ctx.params.join;
      },
    },
    leave: {
      handler(ctx: any) {
        ctx.meta.$leave = ctx.params.leave;
      },
    },
  },
  methods: {
    initSocketIO(srv: any, opts: any) {
      if ("object" === typeof srv && srv instanceof Object && !srv.listen) {
        opts = srv;
        srv = null;
      }
      opts = opts || this.settings.io.options || {};
      srv =
        srv ||
        this.server ||
        (this.settings.server ? this.settings.port : undefined);
      if (this.settings.cors && this.settings.cors.origin && !opts.origins) {
        // cors settings
        opts.origins = function(origin: any, callback: any) {
          if (!this.settings.cors.origin || this.settings.cors.origin === "*") {
            console.debug(`origin ${origin} is allowed.`);
            callback(null, true);
          } else if (
            (this.checkOrigin || checkOrigin)(origin, this.settings.cors.origin)
          ) {
            console.debug(`origin ${origin} is allowed by checkOrigin.`);
            callback(null, true);
          } else {
            console.debug(`origin ${origin} is not allowed.`);
            return callback("origin not allowed", false);
          }
        }.bind(this);
      }
      this.io = new IO(srv, opts);
    },
    socketGetMeta(socket: any) {
      const meta = {
        $rooms: Object.keys(socket.rooms),
        user: socket.client.user,
      };
      console.debug("getMeta", meta);
      return meta;
    },
    socketSaveMeta(socket: any, ctx: any) {
      this.socketSaveUser(socket, ctx.meta.user);
    },
    socketSaveUser(socket: any, user: any) {
      socket.client.user = user;
    },
    socketOnError(err: any, respond: any) {
      const errDebug = _.pick(err, [
        "name",
        "message",
        "code",
        "type",
        "data",
        "stack",
      ]);
      console.debug("socketOnError:", errDebug);
      const errObj = _.pick(err, ["name", "message", "code", "type", "data"]);
      return respond(errObj);
    },
    socketJoinRooms(socket: any, rooms: any) {
      console.debug(`socket ${socket.id} join room:`, rooms);
      return new Promise((resolve, reject) => {
        socket.join(rooms, (err: any) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    },
    socketLeaveRoom(socket: any, room: any) {
      return new Promise((resolve: any, reject: any) => {
        socket.leave(room, (err: any) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    },
  },
};

function checkWhitelist(action: any, whitelist: any) {
  return (
    whitelist.find((mask: any) => {
      if (_.isString(mask)) {
        return match(action, mask);
      } else if (_.isRegExp(mask)) {
        return mask.test(action);
      }
    }) != null
  );
}

function checkOrigin(origin: any, settings: any) {
  if (_.isString(settings)) {
    if (settings.indexOf(origin) !== -1) {
      return true;
    }

    if (settings.indexOf("*") !== -1) {
      // Based on: https://github.com/hapijs/hapi
      // eslint-disable-next-line
      const wildcard = new RegExp(
        `^${_.escapeRegExp(settings)
          .replace(/\\\*/g, ".*")
          .replace(/\\\?/g, ".")}$`,
      );
      return origin.match(wildcard);
    }
  } else if (Array.isArray(settings)) {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < settings.length; i++) {
      if (checkOrigin(origin, settings[i])) {
        return true;
      }
    }
  }

  return false;
}

function makeAuthorizeMiddleware(svc: any, handlerItem: any) {
  return async function authorizeMiddleware(socket: any, next: any) {
    try {
      const res = await svc.socketAuthorize(socket, handlerItem);
      if (res) {
        svc.socketSaveUser(socket, res);
      }
      next();
    } catch (e) {
      return next(e);
    }
  };
}

function makeHandler(svc: any, handlerItem: any) {
  svc.logger.debug("makeHandler:", handlerItem);
  return async function(action: any, params: any, respond: any) {
    svc.logger.info(`   => Client '${this.id}' call '${action}'`);
    if (
      svc.settings.logRequestParams &&
      svc.settings.logRequestParams in svc.logger
    ) {
      svc.logger[svc.settings.logRequestParams]("   Params:", params);
    }
    try {
      if (_.isFunction(params)) {
        respond = params;
        params = null;
      }
      const res = await svc.actions.call({
        action,
        handlerItem,
        params,
        socket: this,
      });
      svc.logger.info(`   <= ${chalk.green.bold("Success")} ${action}`);
      if (_.isFunction(respond)) {
        respond(null, res);
      }
    } catch (err) {
      if (
        svc.settings.log4XXResponses ||
        (err && !_.inRange(err.code, 400, 500))
      ) {
        svc.logger.error(
          "   Request error!",
          err.name,
          ":",
          err.message,
          "\n",
          err.stack,
          "\nData:",
          err.data,
        );
      }
      if (_.isFunction(respond)) {
        svc.socketOnError(err, respond);
      }
    }
  };
}
