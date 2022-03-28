import './index.scss';

import { AssetManagerPlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, Kibana Platform `plugin()` initializer.
export function plugin() {
  return new AssetManagerPlugin();
}
export { AssetManagerPluginSetup, AssetManagerPluginStart } from './types';
