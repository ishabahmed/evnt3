import Router from 'next/router'
import Head from 'next/head';
import Script from 'next/script';
import Link from 'next/link';
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';

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
            connectContract();
        }
    };

    let address;
    const connectContract = async () => {
        const abi = [
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "eventId",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "address",
                  "name": "booker",
                  "type": "address"
                }
              ],
              "name": "EventBooked",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "eventId",
                  "type": "uint256"
                }
              ],
              "name": "EventCreated",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "string",
                  "name": "",
                  "type": "string"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "name": "EventDetails",
              "type": "event"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "name": "events",
              "outputs": [
                {
                  "internalType": "address",
                  "name": "organiser",
                  "type": "address"
                },
                {
                  "internalType": "string",
                  "name": "name",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "startTime",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "endTime",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "bookingCost",
                  "type": "uint256"
                },
                {
                  "internalType": "bool",
                  "name": "exists",
                  "type": "bool"
                }
              ],
              "stateMutability": "view",
              "type": "function",
              "constant": true
            },
            {
              "inputs": [
                {
                  "internalType": "string",
                  "name": "_name",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "_startTime",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "_endTime",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "_bookingCost",
                  "type": "uint256"
                }
              ],
              "name": "createEvent",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "_eventId",
                  "type": "uint256"
                }
              ],
              "name": "bookEvent",
              "outputs": [],
              "stateMutability": "payable",
              "type": "function",
              "payable": true
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "_eventId",
                  "type": "uint256"
                }
              ],
              "name": "checkBooking",
              "outputs": [
                {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
                }
              ],
              "stateMutability": "view",
              "type": "function",
              "constant": true
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "_eventId",
                  "type": "uint256"
                }
              ],
              "name": "getEventDetails",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            }
          ];
        address = "0x5457a05dD3D235c68b3C0929b052D6D32dF95491";
        window.web3 = await new Web3(window.ethereum);
        window.contract = await new window.web3.eth.Contract(abi, address);
    }
    
    const bookEvent = async () => {
        var id = document.getElementById("eventId").value;

        var feeInMatic;
        await window.contract.methods.getEventDetails(id).send({ from: currentAccount }).then(receipt => {
            console.log(JSON.stringify(receipt, null, 4));
            console.log(receipt);
            for (var x in receipt.events) {
                if (x == "EventDetails") {
                    var msgsender = receipt.events[x].returnValues[0];
                    var name = receipt.events[x].returnValues[1];
                    var startTimestamp = receipt.events[x].returnValues[2];
                    var endTimestamp = receipt.events[x].returnValues[3];
                    var feeInWei = receipt.events[x].returnValues[4];

                    var fee = Web3.utils.fromWei(feeInWei);
                    feeInMatic = fee;
                    var startDate = new Date(startTimestamp * 1000);
                    console.log(msgsender, name, startDate.toLocaleDateString("en-GB"), fee);
                    document.getElementById("bookingStatus").innerHTML = `Booking: ${name} on ${startDate.toLocaleDateString("en-GB")} for ${fee} MATIC`;
                }
            }
        });

        await window.contract.methods.bookEvent(id).send({ from: currentAccount, value: Web3.utils.toWei(feeInMatic, 'ether')}).then(receipt => {
            console.log(JSON.stringify(receipt, null, 4));
            console.log(receipt);
            for (var x in receipt.events) {
                if (x == "EventBooked") {
                    console.log(receipt.events[x].returnValues.eventId);
                    document.getElementById("bookingStatus").innerHTML = 'EVENT BOOKED!';
                }
            }
        });
    }

    return (
        <div className="container">
          <Head>
            <meta charSet="UTF-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <Script src="https://cdn.jsdelivr.net/gh/ethereum/web3.js@1.0.0-beta.36/dist/web3.min.js" integrity="sha256-nWBTbvxhJgjslRyuAKJHK+XcZPlCnmIAAMixz6EefVk=" crossorigin="anonymous" />
            <title>Event Booking - Create</title>
          </Head>

          <Link href="/create_event">Create Event</Link>

          <br />
          <br />
          <br />
        <div className="grid">
         <form className="card">
          <p>Event ID:</p>
          <input id="eventId" type="text" /> <br />

          <button onClick={bookEvent}>Book Event</button>
          </form>
          <br />
          <br />
          <br />
          <p id="bookingStatus"></p>
        </div>
          <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: row
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