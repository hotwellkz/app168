import { showErrorNotification } from '../utils/notifications';

const TELEGRAM_BOT_TOKEN = '8147365010:AAFfUqOsbFjLAOYHqCJWl7D7xDxotTlMYd4';
const TELEGRAM_CHAT_ID = '-4632290947'; // Replace with your actual chat ID

export const sendTelegramNotification = async (message: string) => {
  try {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      throw new Error('Telegram configuration missing');
    }

    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: false
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.description || 'Failed to send Telegram notification');
    }

    return true;
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
    throw error;
  }
};

export const formatTransactionMessage = (
  fromUser: string,
  toUser: string,
  amount: number,
  description: string,
  type: 'income' | 'expense',
  waybillNumber: string
): string => {
  const emoji = type === 'income' ? '📥' : '📤';
  const formattedAmount = Math.round(amount).toLocaleString('ru-RU');
  const waybillLink = `https://t.me/HotWellBot/waybill/${waybillNumber}`;

  return `
${emoji} <b>Складская операция</b>

<b>От:</b> ${fromUser}
<b>Кому:</b> ${toUser}
<b>Сумма:</b> ${formattedAmount} ₸
<b>Примечание:</b> ${description}
<b>Накладная:</b> <a href="${waybillLink}">№${waybillNumber}</a>
  `.trim();
};