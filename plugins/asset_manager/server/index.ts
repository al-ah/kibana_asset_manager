import { PluginInitializerContext } from '../../../src/core/server';
import { AssetManagerPlugin } from './plugin';

//  This exports static code and TypeScript types,
//  as well as, Kibana Platform `plugin()` initializer.

export function plugin(initializerContext: PluginInitializerContext) {
  return new AssetManagerPlugin(initializerContext);
}

export { AssetManagerPluginSetup, AssetManagerPluginStart } from './types';
