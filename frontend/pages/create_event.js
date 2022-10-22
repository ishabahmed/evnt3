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
    }

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

    const createEvent = async () => {
        var name = document.getElementById("eventName").value;
        var startDate = document.getElementById("eventStart").value;
        var endDate = document.getElementById("eventEnd").value;
        var fee = document.getElementById("eventFee").value;

        var startTimestamp = Math.floor(new Date(startDate).getTime() / 1000).toString();
        var endTimestamp = Math.floor(new Date(endDate).getTime() / 1000).toString();
        
        // var EventCreatedEventSignature = web3.eth.abi.encodeEventSignature('EventCreated(uint eventId)');
        await window.contract.methods.createEvent(name, startTimestamp, endTimestamp, Web3.utils.toWei(fee, 'ether')).send({ from: currentAccount } ).then(receipt => {
            console.log(JSON.stringify(receipt, null, 4));
            console.log(receipt);
            for (var x in receipt.events) {
                if (x == "EventCreated") {
                    console.log(receipt.events[x].returnValues.eventId);
                    document.getElementById("eventId").innerHTML = `EVENT CREATED WITH ID: ${receipt.events[x].returnValues.eventId}`;
                }
            }
        });
    }

    return (
        <div>
          <Head>
            <meta charSet="UTF-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <Script src="https://cdn.jsdelivr.net/gh/ethereum/web3.js@1.0.0-beta.36/dist/web3.min.js" integrity="sha256-nWBTbvxhJgjslRyuAKJHK+XcZPlCnmIAAMixz6EefVk=" crossorigin="anonymous" />
            <title>Event Booking - Create</title>
          </Head>

          <Link href="/book_event">Book Event</Link>

          <br />
          <br />
          <br />

          <p>Name:</p>
          <input id="eventName" type="text" /> <br />

          <p>Start Date:</p>
          <input id="eventStart" type="date" /> <br />

          <p>End Date:</p>
          <input id="eventEnd" type="date" /> <br />

          <p>Fee:</p>
          <input id="eventFee" type="number" /> <br />

          <br />

          <button onClick={createEvent}>Create Event</button>

          <br />
          <br />
          <br />

          <p id="eventId"></p>

        </div>
    );
}
