import { Agent } from "https";

/**
 * 创建一个自定义的httpsAgent，忽略SSL证书验证
 */
export const httpsAgent = new Agent({ rejectUnauthorized: false });
