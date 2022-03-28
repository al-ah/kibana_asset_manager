import { NavigationPublicPluginStart } from '../../../src/plugins/navigation/public';

export interface AssetManagerPluginSetup {
  getGreeting: () => string;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AssetManagerPluginStart {}

export interface AppPluginStartDependencies {
  navigation: NavigationPublicPluginStart;
}
