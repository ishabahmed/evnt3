import React from "react";
import { render } from "react-dom";
import { QRCode } from "react-qr-svg";

const styles = {
  root: {
    color: "#2C1752",
    fontFamily: "sans-serif",
    textAlign: "center"
  },
  title: {
    color: "#7B3FE4"
  }
};

// update with your contract address
const deployedContractAddress = "0x31E9dD4c5DD72ad0eb8260C2b32BEa67Fad63F3b";

// more info on query based requests: https://0xpolygonid.github.io/tutorials/wallet/proof-generation/types-of-auth-requests-and-proofs/#query-based-request
const qrProofRequestJson = {
  id: "c811849d-6bfb-4d85-936e-3d9759c7f105",
  typ: "application/iden3comm-plain-json",
  type: "https://iden3-communication.io/proofs/1.0/contract-invoke-request",
  body: {
    transaction_data: {
      contract_address: deployedContractAddress,
      method_id: "b68967e2",
      chain_id: 80001,
      network: "polygon-mumbai"
    },
    reason: "booking deposit",
    scope: [
      {
        id: 1,
        circuit_id: "credentialAtomicQuerySig",
        rules: {
          query: {
            allowed_issuers: ["119yLa15n3VppD7XumDeWRjRjDem1MtFRKULkcbJMP"],
            req: {
              AttendedHackathon: {
                $eq: 1
              }
            },
            schema: {
              url:
                "https://s3.eu-west-1.amazonaws.com/polygonid-schemas/211400c1-1b08-4a08-b94e-65d3d751d525.json-ld",
              type: "HackathonAttendee"
            }
          }
        }
      }
    ]
  }
};

export default class App extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <div style={styles.root}>
        <h2 style={styles.title}>Reclaim your deposit</h2>
        <p>Attendance verification: You must prove you attended the event.</p>

        <div>
          <QRCode
            level="Q"
            style={{ width: 256 }}
            value={JSON.stringify(qrProofRequestJson)}
          />
        </div>
        <br />
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
