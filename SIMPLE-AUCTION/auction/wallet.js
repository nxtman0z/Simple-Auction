import { AppConfig, UserSession, showConnect } from '@stacks/connect';

const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });

export function connectWallet() {
  showConnect({
    appDetails: { name: 'Simple Auction DApp', icon: window.location.origin + '/logo192.png' },
    userSession,
    onFinish: () => window.location.reload(),
    onCancel: () => console.log('User cancelled connection'),
  });
}

export function getUserAddress() {
  if (userSession.isUserSignedIn()) {
    const { profile } = userSession.loadUserData();
    return profile.stxAddress?.testnet || null;
  }
  return null;
}
