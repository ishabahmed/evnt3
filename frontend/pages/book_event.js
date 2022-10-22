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
        <div>
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

          <p>Event ID:</p>
          <input id="eventId" type="text" /> <br />

          <button onClick={bookEvent}>Book Event</button>

          <br />
          <br />
          <br />
          <p id="bookingStatus"></p>
        </div>
    );
}
