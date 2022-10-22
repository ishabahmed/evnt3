import Head from 'next/head';
import Script from 'next/script';
import Link from 'next/link';
import detectEthereumProvider from '@metamask/detect-provider';

export default function Home() {

    detectEthereumProvider().then((provider) => {
        if (provider && provider.isMetaMask) {
          provider.on('accountsChanged', handleAccountsChanged);
          checkConnection();
        } else {
          console.log('Please install MetaMask!');
        }
    });

    let currentAccount = null;
    const connectMetamask = async () => {
        if (window.ethereum) {
            try {
                await ethereum.request({method: "eth_requestAccounts"}).then(handleAccountsChanged);
            } catch(error) {
                console.error("User denied account access")
            }
        }
    }

    function checkConnection() {
        ethereum.request({ method: 'eth_accounts' }).then(handleAccountsChanged).catch(console.error);
    }
      
    function handleAccountsChanged(accounts) {
      
        if (accounts.length === 0) {
          document.getElementById("connect").style.display = "block";
          document.getElementById("connectionStatus").innerHTML = "Not connected to Metamask";
          document.getElementById("main").style.display = "none";
        } else if (accounts[0] !== currentAccount) {
          currentAccount = accounts[0];
          document.getElementById("connect").style.display = "none";
          document.getElementById("connectionStatus").innerHTML = `Account is: ${currentAccount}`;
          document.getElementById("main").style.display = "block";
        }
        
    }

    return (
        <div>
          <Head>
            <meta charSet="UTF-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <Script src="https://cdn.jsdelivr.net/gh/ethereum/web3.js@1.0.0-beta.36/dist/web3.min.js" integrity="sha256-nWBTbvxhJgjslRyuAKJHK+XcZPlCnmIAAMixz6EefVk=" crossorigin="anonymous" />
            <title>Event Booking - Home</title>
          </Head>
          
          <button id="connect" onClick={connectMetamask}>Connect to Metamask</button>
          <p id="connectionStatus">Not connected to Metamask</p>

          <div id="main" style={{display: 'none'}}>
            <Link href="/book_event">Book Event</Link> <br />
            <Link href="/create_event">Create Event</Link>
          </div>
          <br />
        </div>
    );
}