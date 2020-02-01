"use strict";
import brokerConfig from 'BaseService/config/moleculer.config'
import SlackConfig from './src/utilities/slack'
new SlackConfig().setup().on()
const config = brokerConfig;
config.nodeID = "service-core";
module.exports = config;
