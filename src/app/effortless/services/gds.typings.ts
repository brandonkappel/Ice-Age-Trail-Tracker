
export interface remoteConnection{
   AMQPConnectionString: string;
   AMQPHostname: string;
   VHost: string;
   Name: string;
   AMQPUsername: string;
   AMQPPassword: string;
   actor: string;
   authUser?: string;
   authPassword?: string;
   tokenTime?: string;
   EffortlessAPIEndpointId?: string;
   routeName?: string;
   edit?: boolean;
   serviceEdit?: boolean;
   smqGuest?: any;
   reauth?: boolean;
   displayLimit?: number;
   smqUser?: any;
   AppStates?: any;
 }
 