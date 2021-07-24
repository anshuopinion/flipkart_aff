import express, { ErrorRequestHandler } from "express";
import axios from "axios";
import createError from "http-errors";
import morgan from "morgan";
const app = express();
app.use(express.json());

app.use(morgan("tiny"));
const headers = {
  Connection: "keep-alive",
  "sec-ch-ua":
    '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
  Accept: "application/json, text/javascript, */*; q=0.01",
  CSRF_HEADER: "d3487ee8-e21d-4ecd-bcbc-52fd3a1bc527",
  "sec-ch-ua-mobile": "?1",
  "User-Agent":
    "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.164 Mobile Safari/537.36",
  "X-Requested-With": "XMLHttpRequest",
  "Sec-Fetch-Site": "same-origin",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Dest": "empty",
  Referer: "https://affiliate.flipkart.com/dashboard",
  "Accept-Language": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
  Cookie:
    "T=TI162523529653600121256771856527728587428183072801398310292158882101; _ga=GA1.2.814543103.1626113188; _pxvid=5d0970dc-e3f6-11eb-a013-0242ac12001a; _gid=GA1.2.1105470772.1627091333; pxcts=e34a10d0-ec21-11eb-9875-53d1f572e9d3; AMCVS_17EB401053DAF4840A490D4C%40AdobeOrg=1; AMCV_17EB401053DAF4840A490D4C%40AdobeOrg=-227196251%7CMCIDTS%7C18833%7CMCMID%7C30182934686623055574716070183726658505%7CMCAAMLH-1627696384%7C8%7CMCAAMB-1627696384%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1627098784s%7CNONE%7CMCAID%7CNONE; JSESSIONID=xi3ckhic7pb7142hbfx046sq941626; Network-Type=4g; vh=549; vw=375; dpr=2.000000089406967; s_sq=flipkart-prd%3D%2526pid%253Dwww.flipkart.com%25253A%2526pidt%253D1%2526oid%253Dhttps%25253A%25252F%25252Fwww.flipkart.com%25252Fzebronics-zeb-county-2-3-w-bluetooth-speaker%25252Fp%25252Fitmc430e0d202f49%25253Fpid%25253DACCG3MX%2526ot%253DA; S=d1t10Pz8/Zj8/aExQPz8/Kj8/Tl47RckN70kyJJFvifAlyIFqDIDjkMIB1YkrHF9PLKyhtn+/cFLZ9d0bLHMsQ2/FQw==; SN=VIF35D2165A9F94F33B8ACF0E729A4BF69.TOK2CEDABF2069A455DA62C039E66B44855.1627095443.LO; _px3=a7ef016f93811d99218b26d3bddb9606b54106963310beb9770f1db864ffd09a:8uPsU8KtCVajI7IGoqfifgjnLOvd9e9v7EegdPelkfDDZ/Tduu6AaMFoHFrSRWd7BDgIT7gFEI6KJv2ZbOhW4g==:1000:Wlqc45L/xbgG1JlnEGdxMIn6L/Wg+qHkkw0ZeWBhIrVRG6rqeOZZQQFeCGliR2WReRjSFPvUOeFcSbmF2G1UarDTB/XdY2H6tBfs8AC/I9U6qGuoBHXzBl4ltUHkL/O45FiGb0aaf+r7iSuExzViXNdWj2QA0iQTeWoghKeyuAncDK6GiLvOxV5RYZgftQhyxG5lw4OxTsH52ISW9DA9ZA==; SN=VI211303E58C694367B145A1F3E7C01C96.TOKB121D57CFFFD4833A82894577267053F.1627094636.LO; T=TI162709460473700368566526345643787924068065535052796286817958004756; JSESSIONID=xi3ckhic7pb7142hbfx046sq941626",
};

const appendData = "&affExtParam1=anshusopinion&affExtParam2=anshuraj";

app.post("/generateLink", async (req, res, next) => {
  const { url } = req.body;
  try {
    const { data } = await axios.get(
      `https://affiliate.flipkart.com/a_url_gen?url=${encodeURIComponent(url)}`,
      {
        headers,
      }
    );

    if (data.status == "OK") {
      try {
        const stArry = data.response.converted_url.split("flipkart");
        const dlString =
          "https://dl.flipkart" + stArry[1].replace(".com/", ".com/dl/");
        const { data: short } = await axios.get(
          `https://affiliate.flipkart.com/a_url_shorten?url=${encodeURIComponent(
            dlString + appendData
          )}
            `,
          {
            headers,
          }
        );
        res.json({ short });
      } catch (error) {
        return next(createError(400, error.message));
      }
    }

    console.log(data.response.converted_url);

    // res.json({ data });
  } catch (error) {
    console.log(error.response.data);

    return next(createError(400, error.message));
  }
});

app.use(() => {
  const error = createError(404, "Could not find this route");
  throw error;
});

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  console.log(error.message, error.statusCode);
  if (res.headersSent) {
    return next(error);
  }

  res
    .status(error.statusCode || 500)
    .json({ message: error.message || "An Unknown error occured" });
};

app.use(errorHandler);

app.listen(9000, () => {
  console.log(`App is running on port 9000`);
});
