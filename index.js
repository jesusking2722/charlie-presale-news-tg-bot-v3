const {
  formatNumberWithSpaces,
  checkEthBuy,
  checkSolanaBuy,
} = require("./helper");
require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

// Initialize the bot with polling
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

<<<<<<< HEAD
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

    if (parseFloat(value) >= 2) {
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
      }/tx/${transactions[i].hash})\n🎯 *Live explore on blockchain* 🎯`;

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
    } else {
      console.log("🚫 Purchase less than 2$ : Notification not sent.");
    }
  }
};

const scan = async () => {
=======
const checkPresaleUpdates = async () => {
>>>>>>> 700780f41b7e88f8c7058f5fe6ba1687fb0d6045
  try {
    // Fetch for Solana transactions
    const {
      totalSolanaToken,
      totalSolanaTokenUSD,
      changeSolana,
      solanaBoughtTokens,
      solanaBoughtUsd,
    } = await checkSolanaBuy();

    // Fetch Eth presale data
    const {
      userBought,
      changesEth,
      totalAmount,
      totalUsers,
      totalSoldPrice,
      currentPrice,
      nextPrice,
    } = await checkEthBuy();

    let priceUSD = "0";

    if (userBought) {
      priceUSD = (userBought * parseFloat(currentPrice)).toFixed(2).toString();
    }

    if (changeSolana || (changesEth && Number(priceUSD) > 2)) {
      // If a new purchase is detected (changesEth becomes true)
      let message = "";
      let solanaMessage = "";
      let ethMessage = "";

      console.log(
        "solana bought token: ",
        parseFloat(solanaBoughtTokens).toFixed(2),
        "solana bought usd: ",
        solanaBoughtUsd
      );

      if (changeSolana) {
        solanaMessage = `🔥 *NEW BUY* 🔥\n*$CHRLE:* ${parseFloat(
          solanaBoughtTokens
        ).toFixed(2)}\n$*Dollars:* $${solanaBoughtUsd}\n`;
      } else {
        solanaMessage = "";
      }

      if (changesEth) {
        console.log(
          "eth bought token: ",
          parseFloat(userBought).toFixed(2),
          "eth bought usd: ",
          priceUSD
        );

        console.log(
          "total eth amount: ",
          totalAmount,
          "total eth usd: ",
          totalSoldPrice
        );

        ethMessage = `🔥 *NEW BUY* 🔥\n*$CHRLE:* ${parseFloat(
          userBought
        ).toFixed(2)}\n$*Dollars:* $${priceUSD}\n`;
      } else {
        ethMessage = "";
      }

      const totalSoldTokens = formatNumberWithSpaces(
        parseFloat(parseFloat(totalSolanaToken) + parseFloat(totalAmount))
          .toFixed(2)
          .toString()
      );

      const totalSoldTokenUSD = formatNumberWithSpaces(
        parseFloat(parseFloat(totalSolanaTokenUSD) + parseFloat(totalSoldPrice))
          .toFixed(2)
          .toString()
      );

      message = `🚀 *BUY $CHRLE* 🚀\n*🌐 On Multichain:*  BNB, ETH, POLYGON, BASE, SOL, TON 🌐\n${ethMessage}${solanaMessage}━━━━━━━━━━━━━━━━━━━━━\n💲 *Total Tokens Sold:*  ${totalSoldTokens}\n💰 *Amount Sold:*  $${totalSoldTokenUSD}\n🏷 *Current Price Per Token:*  $${currentPrice}\n🏷 *Next Price Per Token:*  $${nextPrice}\n📈 *Total To Raise:*  $19 830 000\n👥 *Total Holders:*  ${totalUsers}\n━━━━━━━━━━━━━━━━━━━━━\n🔗 *Explore on Blockchain:\n*🌐 [🔍*View on Bscscan*](https://bscscan.com/address/0x1ddf0e740219960f9180ef73cbc7a5383adfc701)\n🌐 [🔍*View on Etherscan*](https://etherscan.io/address/0x07d2af0dd0d5678c74f2c0d7adf34166dd37ae22)\n🌐 [🔍*View on Basescan*](https://basescan.org/address/0x9c29d024c6cdfae7ea5df76068a3b63b904dc3b9)\n🌐 [🔍*View on Polygonscan*](https://polygonscan.com/address/0xb821b7fb4a82443ff6d8480408f9558db409fe2f)\n🎯 *Live explore on blockchain how it is not changed there nothing*`;
      // 7049993896
      //8000008748
      // process.env.CHANNEL_ID;
      await bot.sendVideo(process.env.CHANNEL_ID, process.env.FILE_ID, {
        caption: message,
        parse_mode: "Markdown",
        disable_web_page_preview: true,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Buy $CHRLE",
                url: "https://charlieunicornai-sale.eu/",
              },
            ],
          ],
        },
      });
      console.log("✅ Purchase detected: Notification sent.");
    }
    console.log(changeSolana, changesEth);
  } catch (error) {
    console.error("Error checking presale updates:", error);
  }
};

setInterval(checkPresaleUpdates, 20000);

// bot.onText(/\/start/, async (msg) => {
//   const chatId = msg.chat.id;
//   console.log(chatId);

//   const { totalSolanaToken, totalSolanaTokenUSD, changeSolana } =
//     await checkSolanaBuy();

//   // Fetch Eth presale data
//   const {
//     userBought,
//     changesEth,
//     totalAmount,
//     totalUsers,
//     totalSoldPrice,
//     currentPrice,
//     nextPrice,
//   } = await checkEthBuy();
//   console.log(
//     "total solana Token: ",
//     totalSolanaToken,
//     "total solana token usd: ",
//     totalSolanaTokenUSD
//   );
//   console.log(
//     "total eth amount: ",
//     totalAmount,
//     "total eth usd: ",
//     totalSoldPrice
//   );

//   const totalSoldTokens = formatNumberWithSpaces(
//     parseFloat(parseFloat(totalSolanaToken) + parseFloat(totalAmount))
//       .toFixed(2)
//       .toString()
//   );

//   const totalSoldTokenUSD = formatNumberWithSpaces(
//     parseFloat(parseFloat(totalSolanaTokenUSD) + parseFloat(totalSoldPrice))
//       .toFixed(2)
//       .toString()
//   );

//   console.log(
//     "total tokens: ",
//     totalSoldTokens,
//     "total usd: ",
//     totalSoldTokenUSD
//   );

//   const message = "welcome";

//   // Send a message to the user when they type /start
//   bot.sendVideo(chatId, process.env.FILE_ID, {
//     caption: message,
//     parse_mode: "Markdown",
//     disable_web_page_preview: true,
//     reply_markup: {
//       inline_keyboard: [
//         [
//           {
//             text: "Buy $CHRLE",
//             url: "https://charlieunicornai-sale.eu/",
//           },
//         ],
//       ],
//     },
//   });
//   console.log(chatId);
//   // console.log("✅ Purchase detected: Notification sent.");
// });
