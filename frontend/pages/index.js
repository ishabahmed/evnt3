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
          <div className="container">
          <div className="grid">
          <div className="card">
          <button id="connect" onClick={connectMetamask}>Connect to Metamask</button>
          <p id="connectionStatus">Not connected to Metamask</p>

          <div id="main" style={{display: 'none'}}>
           
            <Link href="/book_event">Book Event</Link> <br />
            <Link href="/create_event">Create Event</Link>
            </div>
          </div>
          </div>
          </div>
          <br />

          <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background-color:rgb(132,85,246);
        }
        
        input[type=text] {
          width: 50%;
          padding: 12px 20px;
          margin: 8px 0;
          flex:1;
          box-sizing: border-box;
          align-items:center;
          color: blue;
          background-color:;
          
        }
        .button {
          background-color: #4CAF50;
          border: none;
          color: white;
          padding: 15px 32px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 16px;
          margin: 4px 2px;
          cursor: pointer;
        }
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: grid;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: center;
          color: black;
          background-color: rgb(106,226,76);
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
        </div>
    );
}