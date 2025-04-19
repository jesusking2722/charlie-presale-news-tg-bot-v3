const axios = require("axios");
require("dotenv").config();

// eth network
const ETHER_API_KEY = process.env.ETHER_API_KEY;
const ETHER_API_URL = process.env.ETHER_API_URL;
const ETHER_ADDRESS = process.env.ETHER_ADDRESS;

// bsc network
const BSC_API_KEY = process.env.BSC_API_KEY;
const BSC_API_URL = process.env.BSC_API_URL;
const BSC_ADDRESS = process.env.BSC_ADDRESS;

// base network
const BASE_API_KEY = process.env.BASE_API_KEY;
const BASE_API_URL = process.env.BASE_API_URL;
const BASE_ADDRESS = process.env.BASE_ADDRESS;

// polygon network
const POL_API_KEY = process.env.POL_API_KEY;
const POL_API_URL = process.env.POL_API_URL;
const POL_ADDRESS = process.env.POL_ADDRESS;

const getAllEthTransactions = async () => {
  try {
    const response = await axios.get(ETHER_API_URL, {
      params: {
        module: "account",
        action: "txlist",
        address: ETHER_ADDRESS,
        startblock: 0,
        endblock: 99999999,
        page: 1,
        offset: 10000,
        sort: "desc",
        apikey: ETHER_API_KEY,
      },
    });

    if (response.data.status === "1") {
      const transactions = response.data.result.filter(
        (tx) =>
          tx.functionName === "buyFromNative()" &&
          tx.to.toLowerCase() === ETHER_ADDRESS.toLowerCase() &&
          tx.txreceipt_status === "1"
      );
      return transactions;
    } else if (response.data.message === "No transactions found") {
      return [];
    } else {
      console.error("Error:", response.data.message);
      return null;
    }
  } catch (error) {
    console.error("API request failed:", error.message);
    return null;
  }
};

const getAllBSCTransactions = async () => {
  try {
    const response = await axios.get(BSC_API_URL, {
      params: {
        module: "account",
        action: "txlist",
        address: BSC_ADDRESS,
        startblock: 0,
        endblock: 99999999,
        page: 1,
        offset: 10000,
        sort: "desc",
        apikey: BSC_API_KEY,
      },
    });

    if (response.data.status === "1") {
      const transactions = response.data.result.filter(
        (tx) =>
          tx.functionName === "buyFromNative()" &&
          tx.to.toLowerCase() === BSC_ADDRESS.toLowerCase() &&
          tx.txreceipt_status === "1"
      );
      return transactions;
    } else if (response.data.message === "No transactions found") {
      return [];
    } else {
      console.error("Error:", response.data.message);
      return null;
    }
  } catch (error) {
    console.error("API request failed:", error.message);
    return null;
  }
};

const getAllBaseTransactions = async () => {
  try {
    const response = await axios.get(BASE_API_URL, {
      params: {
        module: "account",
        action: "txlist",
        address: BASE_ADDRESS,
        startblock: 0,
        endblock: 99999999,
        page: 1,
        offset: 10000,
        sort: "desc",
        apikey: BASE_API_KEY,
      },
    });

    if (response.data.status === "1") {
      const transactions = response.data.result.filter(
        (tx) =>
          tx.functionName === "buyFromNative()" &&
          tx.to &&
          tx.to.toLowerCase() === BASE_ADDRESS.toLowerCase() &&
          tx.txreceipt_status === "1"
      );
      console.log(transactions);
      return transactions;
    } else if (response.data.message === "No transactions found") {
      return [];
    } else {
      console.error("Error:", response.data.message);
      return null;
    }
  } catch (error) {
    console.error("API request failed:", error.message);
    return null;
  }
};

const getAllPolTransactions = async () => {
  try {
    const response = await axios.get(POL_API_URL, {
      params: {
        module: "account",
        action: "txlist",
        address: POL_ADDRESS,
        startblock: 0,
        endblock: 99999999,
        page: 1,
        offset: 10000,
        sort: "desc",
        apikey: POL_API_KEY,
      },
    });

    if (response.data.status === "1") {
      const transactions = response.data.result.filter(
        (tx) =>
          tx.functionName === "buyFromNative()" &&
          tx.to &&
          tx.to.toLowerCase() === POL_ADDRESS.toLowerCase() &&
          tx.txreceipt_status === "1"
      );
      return transactions;
    } else if (response.data.message === "No transactions found") {
      return [];
    } else {
      console.error("Error:", response.data.message);
      return null;
    }
  } catch (error) {
    console.error("API request failed:", error.message);
    return null;
  }
};

module.exports = {
  getAllEthTransactions,
  getAllBSCTransactions,
  getAllBaseTransactions,
  getAllPolTransactions,
};
