export interface DBConfig {
    host: string;
    user: string;
    password: string;
    name: string;
}
export interface AppConfig {
    port: number;
    jwtSecret: string;
}
export interface Config {
    database: DBConfig;
    app: AppConfig;
}
declare const config: Config;
export default config;
//# sourceMappingURL=config.d.ts.map