import dotenv from "dotenv";
import envVars from "preact-cli-plugin-env-vars";

// ... imports or other code up here ...

/**
 * Function that mutates the original webpack config.
 * Supports asynchronous changes when a promise is returned (or it's an async function).
 *
 * @param {import('preact-cli').Config} config - original webpack config
 * @param {import('preact-cli').Env} env - current environment and options pass to the CLI
 * @param {import('preact-cli').Helpers} helpers - object with useful helpers for working with the webpack config
 * @param {Record<string, unknown>} options - this is mainly relevant for plugins (will always be empty in the config), default to an empty object
 */

dotenv.Config();
export default (config, env, helpers, options) => {
  console.log(env);
  /** you can change the config here **/
  envVars(config, env, helpers);
};
