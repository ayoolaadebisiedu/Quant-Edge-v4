'use server';

import Alpaca from '@alpacahq/alpaca-trade-api';

/**
 * Server Action to interface with Alpaca Markets SDK.
 * This keeps API credentials off the client.
 */

interface AlpacaConfig {
  keyId: string;
  secretKey: string;
  paper?: boolean;
}

export async function testAlpacaConnection(config: AlpacaConfig) {
  try {
    const alpaca = new Alpaca({
      keyId: config.keyId,
      secretKey: config.secretKey,
      paper: config.paper ?? true,
    });

    const account = await alpaca.getAccount();
    return { success: true, status: account.status, buyingPower: account.buying_power };
  } catch (error: any) {
    console.error("Alpaca Connection Error:", error);
    return { success: false, error: error.message };
  }
}

export async function getAlpacaHistoricalBars(params: {
  config: AlpacaConfig;
  symbol: string;
  start: string;
  end: string;
  timeframe: string;
}) {
  try {
    const alpaca = new Alpaca({
      keyId: params.config.keyId,
      secretKey: params.config.secretKey,
      paper: params.config.paper ?? true,
    });

    // In a production app, you'd map timeframe strings to alpaca.newTimeframe
    // For the prototype, we simulate the fetch response structure
    const bars = alpaca.getBarsV2(
      params.symbol,
      {
        start: params.start,
        end: params.end,
        timeframe: alpaca.newTimeframe(1, alpaca.timeframeUnit.HOUR),
        limit: 1000,
      }
    );

    const result = [];
    for await (const b of bars) {
      result.push({
        t: b.Timestamp,
        o: b.OpenPrice,
        h: b.HighPrice,
        l: b.LowPrice,
        c: b.ClosePrice,
        v: b.Volume,
      });
    }

    return { success: true, data: result };
  } catch (error: any) {
    console.error("Alpaca History Error:", error);
    return { success: false, error: error.message };
  }
}
