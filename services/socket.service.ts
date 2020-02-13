import { ServiceMethods, ServiceSchema } from "moleculer";

import SocketMixin = require("../mixin/socket");
import middlewares from "../src/middlewares";
class SocketService implements ServiceSchema {
  public name: string = "socket";
  public mixins: any[] = [SocketMixin];
  public methods: ServiceMethods = {
    async socketAuthorize(socket: any, handlerItem: any) {
      const user = await middlewares.authenticateSocket(
        socket.handshake.query.token,
      );
      socket.join(user.payload.org_id);
      return user;
    },
  };
}
module.exports = new SocketService();
