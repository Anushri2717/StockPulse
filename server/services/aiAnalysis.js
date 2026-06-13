const OpenAI = require('openai');

const getAISuggestion = async ({ symbol, history, currentPrice, buyPrice }) => {
  // If no OpenAI key, return a mock response
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_key_here') {
    const pnl = (((currentPrice - buyPrice) / buyPrice) * 100).toFixed(2);
    const trend = currentPrice > buyPrice ? 'upward' : 'downward';
    return {
      action: pnl > 5 ? 'HOLD' : pnl < -10 ? 'SELL' : 'HOLD',
      reason: `${symbol} is showing a ${trend} trend with ${pnl}% change from your buy price of $${buyPrice}. Monitor closely for the next few sessions before making a decision.`,
      risk: Math.abs(pnl) > 15 ? 'HIGH' : Math.abs(pnl) > 8 ? 'MEDIUM' : 'LOW'
    };
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const pnl = (((currentPrice - buyPrice) / buyPrice) * 100).toFixed(2);
  const prices = history.slice(-10).map(h => `${h.date}: $${h.close}`).join('\n');

  const response = await client.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{
      role: 'user',
      content: `Analyze ${symbol} stock. Current: $${currentPrice}, Buy price: $${buyPrice}, P&L: ${pnl}%.\nLast 10 days:\n${prices}\nRespond ONLY as JSON: {"action":"BUY|SELL|HOLD","reason":"2-3 sentences","risk":"LOW|MEDIUM|HIGH"}`
    }],
    max_tokens: 200,
  });

  try {
    return JSON.parse(response.choices[0].message.content.trim());
  } catch {
    return { action: 'HOLD', reason: response.choices[0].message.content, risk: 'MEDIUM' };
  }
};

module.exports = { getAISuggestion };