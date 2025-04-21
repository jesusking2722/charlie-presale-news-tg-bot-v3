const {
  getAllEthTransactions,
  getAllBSCTransactions,
  getAllBaseTransactions,
  getAllPolTransactions,
} = require("./utils");
const { checkSolanaBuy, checkEthBuy, fetchPrices } = require("./utils/web3");
const { formatNumberWithSpaces, weiToUsd } = require("./utils/helper");
require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

let flag = true;

let totalEthTxCount = 0;
let totalBscTxCount = 0;
let totalBaseTxCount = 0;
let totalPolTxCount = 0;

const CHANNEL_ID = process.env.CHANNEL_ID;
const FILE_ID = process.env.FILE_ID;

const setTotalCounts = (eth, bsc, base, pol) => {
  totalEthTxCount = eth.length;
  totalBscTxCount = bsc.length;
  totalBaseTxCount = base.length;
  totalPolTxCount = pol.length;
};

const sendMessage = async (
  totalTxCount,
  transactions,
  coinPrice,
  currentChrlePrice,
  nextChrlePrice,
  totalSoldTokens,
  totalSoldTokenUSD,
  totalUsers,
  totalSolanaUsers,
  type
) => {
  for (let i = 0; i < transactions.length - totalTxCount; i++) {
    const value = weiToUsd(transactions[i].value, coinPrice);
    const boughtMessage = `🔥 *NEW BUY ON ${
      type === "ETH"
        ? "ETH"
        : type === "BSC"
        ? "BNB"
        : type === "BASE"
        ? "BASE"
        : type === "POL"
        ? "POLYGON"
        : ""
    }* 🔥\n*$CHRLE:* ${parseFloat(value / currentChrlePrice).toFixed(
      2
    )}\n$*Dollars:* $${parseFloat(value).toFixed(2)}\n`;

    const completedMessage = `🚀 *BUY $CHRLE* 🚀\n*🌐 On Multichain:*  BNB, ETH, POLYGON, BASE, SOL, TON 🌐\n${boughtMessage}━━━━━━━━━━━━━━━━━━━━━\n💲 *Total Tokens Sold:*  ${totalSoldTokens}\n💰 *Amount Sold:*  $${totalSoldTokenUSD}\n🏷 *Current Price Per Token:*  $${currentChrlePrice}\n🏷 *Next Price Per Token:*  $${nextChrlePrice}\n📈 *Total To Raise:*  $19 830 000\n👥 *Total Holders:*  ${Number(
      totalUsers + totalSolanaUsers
    )}\n━━━━━━━━━━━━━━━━━━━━━\n🔗 *Explore on Blockchain:\n*🔍*View on explorer*\n🌐(${
      type === "ETH"
        ? "https://etherscan.io"
        : type === "BSC"
        ? "https://bscscan.com"
        : type === "BASE"
        ? "https://basescan.org"
        : type === "POL"
        ? "https://polygonscan.com"
        : ""
    }/tx/${
      transactions[i].hash
    })\n🎯 *Live explore on blockchain how it is not changed there nothing*`;

    await bot.sendVideo(CHANNEL_ID, FILE_ID, {
      caption: completedMessage,
      parse_mode: "Markdown",
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Buy $CHRLE",
              url: "https://charlieunicornai-sale.eu",
            },
          ],
        ],
      },
    });
    console.log("✅ Purchase detected: Notification sent.");
  }
};

const scan = async () => {
  try {
    // start networks scanning
    const eth = await getAllEthTransactions();
    const bsc = await getAllBSCTransactions();
    const base = await getAllBaseTransactions();
    const pol = await getAllPolTransactions();

    // initialize all trasaction counts
    if (flag) {
      setTotalCounts(eth, bsc, base, pol);
      flag = false;
      return;
    }

    console.log("total eth tx count: ", totalEthTxCount);
    console.log("current eth tx count: ", eth.length);
    console.log("total bsc tx count: ", totalBscTxCount);
    console.log("current bsc tx count: ", bsc.length);
    console.log("total base tx count: ", totalBaseTxCount);
    console.log("current base tx count: ", base.length);
    console.log("total polygon tx count: ", totalPolTxCount);
    console.log("current polygon tx count: ", pol.length);

    // start solana scanning
    const {
      totalSolanaToken,
      totalSolanaTokenUSD,
      changeSolana,
      solanaBoughtTokens,
      solanaBoughtUsd,
      txId,
      totalSolanaUsers,
    } = await checkSolanaBuy();

    // validate if someone bought
    if (
      totalEthTxCount < eth.length ||
      totalBscTxCount < bsc.length ||
      totalBaseTxCount < base.length ||
      totalPolTxCount < pol.length ||
      changeSolana
    ) {
      // fetch total amount, total sold and current price and next price using all evm networks smart contracts via ankr rpc endpoints
      const {
        totalAmount,
        totalSoldPrice,
        currentPrice,
        nextPrice,
        totalUsers,
      } = await checkEthBuy();

      // fetch all native coins prices (eth, bnb, base, pol)
      const { ethPrice, bnbPrice, basePrice, polPrice } = await fetchPrices();

      // calculate total sold tokens in evm and svm
      const totalSoldTokens = formatNumberWithSpaces(
        parseFloat(parseFloat(totalSolanaToken) + parseFloat(totalAmount))
          .toFixed(2)
          .toString()
      );

      console.log("total sold tokens: ", totalSoldTokens);

      // calculate total sold tokens for usd in evm and svm
      const totalSoldTokenUSD = formatNumberWithSpaces(
        parseFloat(parseFloat(totalSolanaTokenUSD) + parseFloat(totalSoldPrice))
          .toFixed(2)
          .toString()
      );

      console.log("total sold tokens usd: ", totalSoldTokenUSD);

      // if someone bought with solana
      if (changeSolana) {
        const boughtMessage = `🔥 *NEW BUY* 🔥\n*$CHRLE:* ${parseFloat(
          solanaBoughtTokens
        ).toFixed(2)}\n$*Dollars:* $${solanaBoughtUsd}\n`;

        // To do: fetch tx hash link
        const completedMessage = `🚀 *BUY $CHRLE* 🚀\n*🌐 On Multichain:*  BNB, ETH, POLYGON, BASE, SOL, TON 🌐\n${boughtMessage}━━━━━━━━━━━━━━━━━━━━━\n💲 *Total Tokens Sold:*  ${totalSoldTokens}\n💰 *Amount Sold:*  $${totalSoldTokenUSD}\n🏷 *Current Price Per Token:*  $${currentPrice}\n🏷 *Next Price Per Token:*  $${nextPrice}\n📈 *Total To Raise:*  $19 830 000\n👥 *Total Holders:*  ${Number(
          totalUsers + totalSolanaUsers
        )}\n━━━━━━━━━━━━━━━━━━━━━\n🔗 *Explore on Blockchain:\n*🌐 [🔍*View on Solscan*](https://solscan.io/tx/${txId})\n🎯 *Live explore on blockchain how it is not changed there nothing*`;
        await bot.sendVideo(CHANNEL_ID, FILE_ID, {
          caption: completedMessage,
          parse_mode: "Markdown",
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Buy $CHRLE",
                  url: "https://charlieunicornai-sale.eu",
                },
              ],
            ],
          },
        });
        console.log("✅ Purchase detected: Notification sent.");
      }

      // if someone bought with ETH
      if (totalEthTxCount < eth.length) {
        await sendMessage(
          totalEthTxCount,
          eth,
          ethPrice,
          currentPrice,
          nextPrice,
          totalSoldTokens,
          totalSoldTokenUSD,
          totalUsers,
          totalSolanaUsers,
          "ETH"
        );
        totalEthTxCount = eth.length;
      }
      if (totalBscTxCount < bsc.length) {
        await sendMessage(
          totalBscTxCount,
          bsc,
          bnbPrice,
          currentPrice,
          nextPrice,
          totalSoldTokens,
          totalSoldTokenUSD,
          totalUsers,
          totalSolanaUsers,
          "BSC"
        );
        totalBscTxCount = bsc.length;
      }
      if (totalBaseTxCount < base.length) {
        await sendMessage(
          totalBaseTxCount,
          base,
          basePrice,
          currentPrice,
          nextPrice,
          totalSoldTokens,
          totalSoldTokenUSD,
          totalUsers,
          totalSolanaUsers,
          "BASE"
        );
        totalBaseTxCount = base.length;
      }
      if (totalPolTxCount < pol.length) {
        await sendMessage(
          totalPolTxCount,
          pol,
          polPrice,
          currentPrice,
          nextPrice,
          totalSoldTokens,
          totalSoldTokenUSD,
          totalUsers,
          totalSolanaUsers,
          "POL"
        );
        totalPolTxCount = pol.length;
      }
    }
  } catch (error) {
    console.error("scan error: ", error);
  }
};

setInterval(scan, 30000);
