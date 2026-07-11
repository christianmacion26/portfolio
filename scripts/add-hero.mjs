import { readFileSync, writeFileSync } from 'node:fs';
import { glob } from 'glob';

const figures = [
  { file: '01-deflated-sharpe.mdx', fig: '01-multiple-testing-deflated-sharpe.webp', alt: 'Deflated Sharpe Ratio analysis across 160 BTC trading rules. The headline IS Sharpe of 1.14 collapses to a Deflated Sharpe of 0.70 after multiple-testing correction (Bailey & López de Prado, 2014), meaning the apparent edge is consistent with pure-noise selection from 160 trials.' },
  { file: '02-cross-sectional-momentum.mdx', fig: '02-cross-sectional-momentum.webp', alt: 'Cross-sectional momentum on 18 BTC-correlated coins: IS Sharpe 0.91 with bootstrap CI straddles zero; OOS Sharpe −0.03. The chart contrasts the in-sample winner against the out-of-sample reality.' },
  { file: '03-timeseries-momentum-voltarget.mdx', fig: '03-timeseries-momentum-voltarget.webp', alt: 'Time-series momentum with and without vol targeting. Sharpe lifts from 0.27 to 0.39; maximum drawdown halves from −62% to −30%. The equity curve is the same signal under two risk regimes.' },
  { file: '04-variance-risk-premium.mdx', fig: '04-variance-risk-premium.webp', alt: 'Variance Risk Premium across 36 years (VIX minus 30-day realized volatility). The premium is positive 85% of months and predicts equity returns with Newey-West t = +6.5.' },
  { file: '05-pairs-cointegration.mdx', fig: '05-pairs-cointegration.webp', alt: 'BTC / ETH pairs-trade study. Augmented Dickey-Fuller statistic of −2.11 fails the cointegration threshold; estimated mean-reversion half-life of 208 days makes the fade unviable. The chart shows the spread and the failed fade P&L.' },
  { file: '06-funding-carry.mdx', fig: '06-funding-carry.webp', alt: 'Perpetual-swap funding carry across crypto pairs. Headline premium of +11.9% annualized collapses from in-sample Sharpe 1.11 to out-of-sample −0.05 post-2023. The chart shows the decay and the structural break.' },
  { file: '07-macro-regime-overlay.mdx', fig: '07-macro-regime-overlay.webp', alt: 'Volatility-regime overlay on a baseline equity curve. Sharpe lifts from 0.64 to 0.67; maximum drawdown compresses from −58% to −42%. The chart contrasts the unmanaged and regime-scaled equity curves.' },
  { file: '08-backtest-engine-costs.mdx', fig: '08-backtest-engine-costs.webp', alt: 'Backtest engine with realistic cost model (spread + slippage + impact). A high-turnover signal that wins gross (Sharpe 0.20 > 0.13 baseline) loses net of cost — break-even round-trip cost is 20 bps. The chart overlays gross and net equity curves.' },
  { file: '09-lookahead-bias-audit.mdx', fig: '09-bias-audit.webp', alt: 'Lookahead-bias audit harness. The chart compares the as-published equity curve against the leakage-detected curve — the moment a future data point enters the past, the audit flags the gate and the corrected curve diverges.' },
];

for (const { file, fig, alt } of figures) {
  const path = `src/content/projects/quant/${file}`;
  let src = readFileSync(path, 'utf-8');
  if (src.includes('hero:')) {
    console.log('SKIP', file, '(already has hero)');
    continue;
  }
  const heroBlock = `hero:\n  src: /figures/quant/${fig}\n  alt: ${JSON.stringify(alt)}\n  fit: cover\n  aspect: 16/9\n`;
  // Insert after `summary_long:` block, before `stack:`
  // Find the line "stack:" and insert hero block just before it
  if (!src.includes('stack:')) {
    console.log('WARN', file, '(no stack: line)');
    continue;
  }
  const newSrc = src.replace(/(^stack:)/m, heroBlock + '$1');
  writeFileSync(path, newSrc, 'utf-8');
  console.log('OK', file);
}
