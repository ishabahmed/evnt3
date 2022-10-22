import Router from 'next/router'
import detectEthereumProvider from '@metamask/detect-provider';

export default function Book_Event() {

    detectEthereumProvider().then((provider) => {
        if (provider && provider.isMetaMask) {
          provider.on('accountsChanged', handleAccountsChanged);
          checkConnection();
        } else {
          console.log('Please install MetaMask!');
        }
    });

    function checkConnection() {
        ethereum.request({ method: 'eth_accounts' }).then(handleAccountsChanged).catch(console.error);
    }

    let currentAccount = null;
    function handleAccountsChanged(accounts) {
        console.log(accounts);
      
        if (accounts.length === 0) {
            Router.push('/');
        } else if (accounts[0] !== currentAccount) {
            currentAccount = accounts[0];
        }
    }

    return <h1>Book</h1>
}
