import React, { useState } from 'react';
import { i18n } from '@kbn/i18n';
import { FormattedMessage, I18nProvider } from '@kbn/i18n-react';
import { BrowserRouter as Router, Route, RouteComponentProps, withRouter ,Redirect} from 'react-router-dom';
import {
  EuiPage,
  EuiPageBody,
  EuiPageSideBar,
  EuiSideNav
} from '@elastic/eui';

import { CoreStart } from '../../../../src/core/public';
import { NavigationPublicPluginStart } from '../../../../src/plugins/navigation/public';


import Network from './network'
interface AssetManagerAppDeps {
  basename: string;
  notifications: CoreStart['notifications'];
  http: CoreStart['http'];
  navigation: NavigationPublicPluginStart;
}

const NavWithRouter = withRouter(({ history, pages }) => {  

  const [isSideNavOpenOnMobile, setisSideNavOpenOnMobile] = useState(false);

  const toggleOpenOnMobile = () => {
    setisSideNavOpenOnMobile(!isSideNavOpenOnMobile);
  };

  const navItems = pages.map((page) => ({
    id: page.id,
    name: page.title,
    onClick: () => history.push(`/${page.id}`),          
    isSelected: history.location.pathname == `/${page.id}`,
  }));

  return (
    <EuiSideNav    
      aria-label="Basic example"
      mobileTitle="Basic example"
      toggleOpenOnMobile={() => toggleOpenOnMobile()}
      isOpenOnMobile={isSideNavOpenOnMobile}
      style={{ width: 150 }}
      items={[
        {
          name: 'Asset Manager',
          id: 'home',
          items: [...navItems],
        },
      ]}
    />
  );
});


export const AssetManagerApp = ({
  basename,
  notifications,
  http,
  navigation,
}: AssetManagerAppDeps) => {

  const pages = [
    {
      title: 'Networks',
      id: 'networks',
      component: (
        <Network http={http} notifications={notifications}></Network>
      ),
    },
    {
      title: 'Hosts',
      id: 'hosts',
      component: <div>TODO: Not implemented, but coming soon...</div>,
    },
  ];

  const routes = pages.map((page, i) => (
    <Route key={i} path={`/${page.id}`} render={(props) => page.component} />
  ));

  // Render the application DOM.
  // Note that `navigation.ui.TopNavMenu` is a stateful component exported on the `navigation` plugin's start contract.
  return (
    <Router basename={basename}>
      <I18nProvider>
        <>
        <EuiPage>
          <EuiPageSideBar>
            <NavWithRouter pages={pages} />
          </EuiPageSideBar>
          <EuiPageBody>
              {routes}
              <Route
                  path="/"
                  exact
                  render={(routerProps) => {
                      return <Redirect to={`/${pages[0].id}`}></Redirect>
                  }}
              ></Route>
          </EuiPageBody>
        </EuiPage>
        </>
      </I18nProvider>
    </Router>
  );
};
