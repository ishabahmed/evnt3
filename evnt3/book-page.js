import Link from 'next/link';
import Head from 'next/head'
import {useState} from 'react';


export default function FirstPost() {
  const [isShown, setIsShown] = useState(true);

  const handleClick = event => {
    // 👇️ toggle visibility
    setIsShown(current => !current);
  };
  
  return (
    
    <div className="container">
    <Head>
      <title>evnt3</title>
    </Head>
    <h1 className="title">
        Book An Event
      </h1>
      <h3 className="description">
      <Link href="/evnt3/create-page">go to create-an-event page</Link>
        </h3>
    <button onClick={handleClick}>Toggle visibility</button>
  
    <main>
      


      <div className="grid">
        
       <div className="card">
          <label>
            Deposit price:
            "display price"
             </label>

             <button class="button">pay deposit</button>
          </div>
        
        
        <form className="card">
          <label>
            Event ID:
            <input type="text" id="eventID" />
             </label>
            
          </form>
        
        

      </div>
      </main>
      <main style={{display: isShown ? 'block' : 'none'}} > 
    <h1 className="title">
        split test
      </h1>
    </main>

    <style jsx>{`
      .container {
        min-height: 100vh;
        padding: 0 0.5rem;
        display: grid;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color:rgb(132,85,246)
      }
      
      input[type=text] {
        width: 50%;
        padding: 12px 20px;
        margin: 8px 0;
        box-sizing: border-box;
        align-items:center;
        color: blue;
        
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
        
        flex-direction: column;
        justify-content: left;
        align-items: left;
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
        background-color:rgb(106,226,76);
        border-color:blue;
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