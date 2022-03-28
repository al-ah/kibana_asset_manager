import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  Logger,
} from '../../../src/core/server';

import { AssetManagerPluginSetup, AssetManagerPluginStart } from './types';
import { defineRoutes } from './routes';

export class AssetManagerPlugin
  implements Plugin<AssetManagerPluginSetup, AssetManagerPluginStart>
{
  private readonly logger: Logger;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
  }

  public setup(core: CoreSetup) {
    this.logger.debug('Asset Manager: Setup');
    const router = core.http.createRouter();

    // Register server side APIs
    defineRoutes(router);

    return {};
  }

  public start(core: CoreStart) {
    this.logger.debug('Asset Manager: Started');
    return {};
  }

  public stop() {}
}
