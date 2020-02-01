// @ts-ignore
import { SlackLogger } from 'node-slack-logs/dist' 
const envConfig = process.env;

export default class SlackConfig {
    private logger: any;
    private types: Array<string>

    constructor(private title: string = 'CRM/APIV2/SERVICE_CORE') {

    }

    public setup(types = ['error', 'log']) {        
        this.logger = new SlackLogger(this.title);
        this.types = types;
        return this;
    }
    public on() {
        this.logger.register(envConfig.SLACKWEBHOOK, this.types, 'line');
        console.log('Slack log registered successfully');
    }
}
