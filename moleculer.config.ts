"use strict";
import brokerConfig from 'BaseService/config/moleculer.config'
const config = brokerConfig;
config.nodeID = "service-core";
module.exports = config;
