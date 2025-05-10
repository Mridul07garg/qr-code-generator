import express from 'express';
import bodyParser from 'body-parser';
import qrCode from 'qrcode'
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

async function urlExtractor(req, res, next) {
    const url = req.body.url;
    console.log(url);
    if(!url)
    {
        return res.status(400).send("No URL provided");
    }
    try{
        const qrdata = await qrCode.toDataURL(url,
            {
                errorCorrectionLevel: 'H',
                color: {
                    dark: '#000000',  // Black dots
                    light: '#FFFFFF' // Transparent background
                }
            });
        req.qrCode = qrdata;
        req.qurl = url;
        next();
    }
    catch(err){
        console.error(err);
        return res.status(500).send("Error generating QR code");
    }
}




app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/submit", urlExtractor,(req, res) => { 
  res.send("QR Code generated successfully!<br><img src='" + req.qrCode + "'><br>URL: " + req.qurl);
}
);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});