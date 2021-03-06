const Telegram = require('telegraf/telegram');
const keys = require('../config/keys');

const telegram = new Telegram(keys.telegramToken);

const postMessage = async message => {
  return telegram.sendMessage('@hotcryptotwitter', message, {
    parse_mode: 'Markdown',
  });
};

module.exports = { postMessage };
