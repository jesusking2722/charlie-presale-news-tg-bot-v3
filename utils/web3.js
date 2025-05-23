const axios = require("axios");
const {
  NETWORKS,
  PRESALE_ABI,
  feeds,
  aggregatorV3ABI,
} = require("../contract");
const ethers = require("ethers");
const { formatPrice } = require("./helper");
require("dotenv").config();

const SHEET_ID = process.env.SHEET_ID;
let previousSolanaTxCount = null;

const checkEthBuy = async () => {
  try {
    let totalTokensSold = 0;
    let currentPrice = 0;
    let nextPrice = 0;
    let pricePerToken = 0;
    let totalUsers = 0;

    for (const network of NETWORKS) {
      const provider = new ethers.JsonRpcProvider(network.rpcUrl);
      const contract = new ethers.Contract(
        network.contractAddress,
        PRESALE_ABI,
        provider
      );

      // Fetch prices
      const cs = await contract.currentStage();
      const cp = await contract.stagePrices(Number(cs) - 1);
      const np = await contract.stagePrices(Number(cs));

      // Fetch total users
      const users = await contract.totalUsers();
      totalUsers += Number(users);

      // fetch prices
      currentPrice = formatPrice(
        parseFloat(1 / parseFloat(ethers.formatUnits(cp, 18)))
      );
      nextPrice = formatPrice(
        parseFloat(1 / parseFloat(ethers.formatUnits(np, 18)))
      );
      const perDollarPrice = await contract.perDollarPrice();
      const tokensPerUSD = ethers.formatUnits(perDollarPrice, 18);
      pricePerToken = 1 / parseFloat(tokensPerUSD);

      const tokensSold = await contract.totalTokensSold();
      totalTokensSold += parseFloat(ethers.formatUnits(tokensSold, 18));
    }

    const totalTokensSoldReSum = 14031.11 * 5000 + parseFloat(totalTokensSold);
    const totalSoldPrice = (totalTokensSold * pricePerToken + 14031.11).toFixed(
      2
    );

    return {
      totalAmount: parseFloat(totalTokensSoldReSum),
      totalSoldPrice: parseFloat(totalSoldPrice),
      currentPrice,
      nextPrice,
      totalUsers,
    };
  } catch (error) {
    console.log("check buy error: ", error);
    return {
      totalAmount: 0,
      totalSoldPrice: 0,
      currentPrice: 0,
      nextPrice: 0,
      totalUsers: 0,
    };
  }
};

const checkSolanaBuy = async () => {
  try {
    const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;
    const response = await axios.get(URL);

    // Remove unwanted characters at the beginning
    const jsonText = response.data.substring(47).slice(0, -2); // Remove "/*O_o*/" and the trailing semicolon
    const data = JSON.parse(jsonText);

    // Function to convert strings to camelCase
    const toCamelCase = (str) => {
      return str
        .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
          index === 0 ? match.toLowerCase() : match.toUpperCase()
        )
        .replace(/\s+/g, ""); // Remove any spaces
    };

    // Define a mapping for the exact keys you want
    const keyMapping = {
      "Solana Wallet": "solanaWallet",
      "BSC Wallet": "bscWallet",
      "Amount (SOL)": "amount",
      "Tokens Received": "tokens",
      "Transaction ID": "txId",
      "USD Value": "usd",
      Timestamp: "timestamp",
    };

    // Assuming that the first row in the sheet is the header (column names)
    let headers = data.table.cols.map((col) => toCamelCase(col.label)); // Get column names in camelCase
    let rows = data.table.rows.map((row) => {
      const rowData = {};
      row.c.forEach((cell, index) => {
        const cellValue = cell ? cell.v : "";
        const columnName = data.table.cols[index].label;
        // Map the header to the desired key
        const mappedKey = keyMapping[columnName] || toCamelCase(columnName);
        rowData[mappedKey] = cellValue; // Assign the mapped key
      });
      return rowData;
    });

    if (previousSolanaTxCount === null) {
      previousSolanaTxCount = rows.length;
      return {
        totalSolanaToken: 0,
        totalSolanaTokenUSD: 0,
        changeSolana: false,
        solanaBoughtTokens: 0,
        solanaBoughtUsd: 0,
      };
    }
    if (previousSolanaTxCount > rows.length) {
      return {
        totalSolanaToken: 0,
        totalSolanaTokenUSD: 0,
        changeSolana: false,
        solanaBoughtTokens: 0,
        solanaBoughtUsd: 0,
        txId: "",
        totalSolanaUsers: 0,
      };
    }
    if (rows.length > 0) {
      let totalSolanaToken = 0;
      let totalSolanaTokenUSD = 0;
      let changeSolana = previousSolanaTxCount < rows.length;
      previousSolanaTxCount = rows.length;
      for (let i = 13; i < rows.length; i++) {
        totalSolanaToken += parseFloat(rows[i].tokens);
        totalSolanaTokenUSD += parseFloat(rows[i].usd);
      }

      return {
        totalSolanaToken: parseFloat(totalSolanaToken),
        totalSolanaTokenUSD: parseFloat(totalSolanaTokenUSD),
        changeSolana,
        solanaBoughtTokens: rows[rows.length - 1].tokens,
        solanaBoughtUsd: parseFloat(rows[rows.length - 1].usd).toFixed(2),
        txId: rows[rows.length - 1].txId,
        totalSolanaUsers: Number(rows.length),
      };
    }

    return {
      totalSolanaToken: 0,
      totalSolanaTokenUSD: 0,
      changeSolana: false,
      solanaBoughtTokens: 0,
      solanaBoughtUsd: 0,
      txId: "",
      totalSolanaUsers: 0,
    };
  } catch (error) {
    console.error("Error fetching Google Sheet:", error.message);
    return {
      totalSolanaToken: 0,
      totalSolanaTokenUSD: 0,
      changeSolana: false,
      solanaBoughtTokens: 0,
      solanaBoughtUsd: 0,
      txId: "",
      totalSolanaUsers: 0,
    };
  }
};

const fetchPrices = async () => {
  try {
    const prices = {};
    for (const [chain, { rpc, tokens }] of Object.entries(feeds)) {
      const provider = new ethers.JsonRpcProvider(rpc);
      for (const [symbol, address] of Object.entries(tokens)) {
        const feed = new ethers.Contract(address, aggregatorV3ABI, provider);
        const roundData = await feed.latestRoundData();
        const price = Number(roundData.answer) / 1e8;
        prices[symbol] = price;
      }
    }

    return {
      ethPrice: prices.ETH,
      bnbPrice: prices.BNB,
      basePrice: prices.ETH,
      polPrice: prices.MATIC,
    };
  } catch (error) {
    console.error("Error fetching prices:", error);
    return null;
  }
};

module.exports = { checkEthBuy, checkSolanaBuy, fetchPrices };
