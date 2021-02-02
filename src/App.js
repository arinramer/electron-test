import React from 'react';
import { useState, useEffect } from 'react';
import { QRCode } from 'react-qrcode-logo';
import { TwitterTimelineEmbed } from 'react-twitter-embed';
import tezos from "./tezos.png"
import burst from "./burst.png"
import cardano from "./cardano.png"
import './App.css';

function App() {
  const electron = window.require("electron"); 
  const BrowserWindow = electron.remote.BrowserWindow; 
  const path = require("path"); 
  const dialog = electron.remote.dialog; 
  let win = BrowserWindow.getFocusedWindow(); 
  var fs = window.require('fs');
  const takeScreenshot = () => {
    win.webContents 
        .capturePage({ 
            x: 0, 
            y: 0, 
            width: 900, 
            height: 680, 
        }) 
        .then((img) => { 
            dialog 
                .showSaveDialog({ 
                    title: "Select the File Path to save", 
                
                    // Default path to assets folder 
                    defaultPath: path.join(__dirname,  
                                           "../assets/image.png"), 
                
                    // defaultPath: path.join(__dirname,  
                    // '../assets/image.jpeg'), 
                    buttonLabel: "Save", 
                
                    // Restricting the user to only Image Files. 
                    filters: [ 
                        { 
                            name: "Image Files", 
                            extensions: ["png", "jpeg", "jpg"], 
                        }, 
                    ], 
                    properties: [], 
                }) 
                .then((file) => { 
                    // Stating whether dialog operation was  
                    // cancelled or not. 
                    console.log(file.canceled); 
                    if (!file.canceled) { 
                        console.log(file.filePath.toString()); 
  
                        // Creating and Writing to the image.png file 
                        // Can save the File as a jpeg file as well, 
                        // by simply using img.toJPEG(100); 
                        fs.writeFile(file.filePath.toString(),  
                                     img.toPNG(), "base64", function (err) { 
                            if (err) throw err; 
                            console.log("Saved!"); 
                        }); 
                    } 
                }) 
                .catch((err) => { 
                    console.log(err); 
                }); 
        }) 
        .catch((err) => { 
            console.log(err); 
        }); 
  }
  const [prices, setPrices] = useState({
    tezos: "0.00",
    burst: "0.00",
    cardano: "0.00"
  })
  const connection = new WebSocket("wss://ws.coincap.io/prices?assets=tezos,burst,cardano")
  useEffect(() => {
    connection.onmessage = function (msg) {
      const message = JSON.parse(msg.data);
      console.log(message)
      if(message.tezos) {
        setPrices(prevState => ({
          ...prevState,
          tezos: message.tezos
        }));
      } if(message.burst) {
        setPrices(prevState => ({
          ...prevState,
          burst: message.burst
        }));
      } if(message.cardano) {
        setPrices(prevState => ({
          ...prevState,
          cardano: message.cardano
        }));
      } if(message.tezos && message.burst && message.cardano) {
        setPrices(prevState => ({
          ...prevState,
          tezos: message.tezos,
          burst: message.burst,
          cardano: message.cardano,
        }));
      }
    }
  },[prices])
  return (
    <>
      <div className="App">
        <div className="Box" style={{marginLeft: "50px"}}>
          <p>Arin Ramer</p>
          <QRCode value="Arin Ramer" size={100} ecLevel="H" quietZone={5}/>
        </div>
        <div className="Box">
          <p>Tezos price: {prices.tezos}</p>
          <QRCode value={prices.tezos} size={100} ecLevel="H" quietZone={5} logoHeight={30} logoWidth={30} logoImage={tezos}/>
        </div>
        <div className="Box">
          <p>Burst price: {prices.burst}</p>
          <QRCode value={prices.burst} size={100} ecLevel="H" quietZone={5} logoHeight={30} logoWidth={30} logoImage={burst}/>
        </div>
        <div className="Box">
          <p>Cardano price: {prices.cardano}</p>
          <QRCode value={prices.cardano} size={100} ecLevel="H" quietZone={5} logoHeight={35} logoWidth={35} logoImage={cardano}/>
        </div>
      </div>
      <div>
        <div className="Tweets">
          <div className="Tweet">
            <TwitterTimelineEmbed
                sourceType="profile"
                screenName="BBCAfrica"
                options={{height: 350}}
              />
          </div>
          <div className="Tweet">
            <TwitterTimelineEmbed
                sourceType="profile"
                screenName="Ethereum"
                options={{height: 350}}
              />
          </div>
          <button className="Screenshot" onClick={takeScreenshot}>Screenshot</button>
        </div>
        <div className="Links">
            <a href="https://www.linkedin.com/in/arinramer/" target="_blank">LinkedIn</a>
            <a href="https://github.com/arinramer" target="_blank">Github</a>
            <a href="https://docs.google.com/document/d/1-nLgBspFNOeM-JYP5aEvzKTL_-TBPHUuhGMrN2dEK1s/edit?usp=sharing" target="_blank">Résumé</a>
            <a href="mailto:arinramer@gmail.com" target="_blank">arinramer@gmail.com</a>
        </div>
      </div>
    </>
  );
}

export default App;
