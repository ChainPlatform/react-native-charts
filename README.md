# @chainplatform/charts

Reusable chart components for React Native / React Native Web.

<p align="center">
  <a href="https://github.com/ChainPlatform/react-native-charts/blob/HEAD/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" />
  </a>
  <a href="https://www.npmjs.com/package/@chainplatform/react-native-charts">
    <img src="https://img.shields.io/npm/v/@chainplatform/react-native-charts?color=brightgreen&label=npm%20package" alt="Current npm package version." />
  </a>
  <a href="https://www.npmjs.com/package/@chainplatform/react-native-charts">
    <img src="https://img.shields.io/npm/dt/@chainplatform/react-native-charts.svg"></img>
  </a>
  <a href="https://www.npmjs.com/package/@chainplatform/react-native-charts">
    <img src="https://img.shields.io/badge/platform-android%20%7C%20ios%20%7C%20web-blue"></img>
  </a>
  <a href="https://github.com/ChainPlatform/react-native-charts/pulls">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome!" />
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=doansan">
    <img src="https://img.shields.io/twitter/follow/doansan.svg?label=Follow%20@doansan" alt="Follow @doansan" />
  </a>
</p>


[![GitHub stars](https://img.shields.io/github/stars/ChainPlatform/react-native-charts?style=social)](https://github.com/ChainPlatform/react-native-charts)  
[![GitHub forks](https://img.shields.io/github/forks/ChainPlatform/react-native-charts?style=social)](https://github.com/ChainPlatform/react-native-charts)


## Install

```bash
npm install @chainplatform/charts react-native-svg prop-types @chainplatform/layout --save
```

or:

```bash
yarn add @chainplatform/charts react-native-svg prop-types @chainplatform/layout
```

## Usage

```jsx
import React from 'react';
import { View } from 'react-native';
import { BarChart, DonutChart, LineChart } from '@chainplatform/charts';

export default function Example() {
    return (
        <View>
            <BarChart
                data={[12, 18, 9, 24]}
                categories={['T1', 'T2', 'T3', 'T4']}
                enableTooltip
            />

            <DonutChart
                data={[
                    { label: 'Pass', value: 70, total: 70, color: '#10B981' },
                    { label: 'Fail', value: 30, total: 30, color: '#EF4444' },
                ]}
                centerContent="100"
                enableTooltip
            />

            <LineChart
                data={[10, 20, 14, 30, 25]}
                labels={['A', 'B', 'C', 'D', 'E']}
            />
        </View>
    );
}
```

## Components

### BarChart

```jsx
<BarChart data={[10, 20, 30]} categories={['A', 'B', 'C']} enableTooltip />
```

Main props:

| Prop | Type | Default |
| --- | --- | --- |
| `data` | `number[]` | required |
| `categories` | `string[]` | `[]` |
| `chartHeight` | `number` | `setSize(220)` |
| `showGrid` | `boolean` | `true` |
| `gridColor` | `string` | `#ddd` |
| `axisLabelColor` | `string` | `#666` |
| `barSpacing` | `number` | `setSize(12)` |
| `barWidth` | `number` | `setSize(25)` |
| `colors` | `string[]` | default palette |
| `barLabels` | `string[]` | `[]` |
| `theme` | `object` | `null` |
| `enableTooltip` | `boolean` | `true` |

### DonutChart

```jsx
<DonutChart
    data={[{ label: 'Done', value: 60, total: 60, color: '#10B981' }]}
    centerContent="60"
/>
```

Main props:

| Prop | Type | Default |
| --- | --- | --- |
| `data` | `{ label, value, color, total? }[]` | required |
| `size` | `number` | `setSize(320)` |
| `strokeWidth` | `number` | `setSize(70)` |
| `startAngle` | `number` | `-90` |
| `segmentGap` | `number` | `2` |
| `backgroundColor` | `string` | `#ECECEC` |
| `showPercent` | `boolean` | `true` |
| `showInnerLabels` | `boolean` | `true` |
| `centerContent` | `string` | `''` |
| `enableTooltip` | `boolean` | `true` |

### LineChart

```jsx
<LineChart data={[8, 12, 16, 10]} labels={['Q1', 'Q2', 'Q3', 'Q4']} />
```

Main props:

| Prop | Type | Default |
| --- | --- | --- |
| `data` | `number[]` | required |
| `labels` | `string[]` | `[]` |
| `width` | `number` | `setSize(160)` |
| `height` | `number` | `setSize(60)` |
| `strokeColor` | `string` | `#5B7CFA` |
| `strokeWidth` | `number` | `setSize(2)` |
| `showDots` | `boolean` | `true` |
| `dotRadius` | `number` | `setSize(3)` |
| `touchRadius` | `number` | `setSize(10)` |
| `backgroundColor` | `string` | `transparent` |
| `enableTooltip` | `boolean` | `true` |

---

## 🪪 License
MIT © 2026 [Chain Platform](https://chainplatform.net)

---

## 💖 Support & Donate

If you find this package helpful, consider supporting the development:

| Currency | Address |
|----------------|----------|
| **MB Bank** | `MB Bank` |
![alt text](imgs/qr.png)
| **Bitcoin (BTC)** | `17grbSNSEcEybS1nHh4TGYVodBwT16cWtc` |
![alt text](imgs/image-1.png)
| **Ethereum (ETH)** | `0xa2fd119a619908d53928e5848b49bf1cc15689d4` |
![alt text](imgs/image-2.png)
| **Tron (TRX)** | `TYL8p2PLCLDfq3CgGBp58WdUvvg9zsJ8pd` |
![alt text](imgs/image.png)
| **DOGE (DOGE)** | `DDfKN2ys4frNaUkvPKcAdfL6SiVss5Bm19` |
| **USDT (SOLANA)** | `cPUZsb7T9tMfiZFqXbWbRvrUktxgZQXQ2Ni1HiVXgFm` |


Your contribution helps maintain open-source development under the Chain Platform ecosystem 🚀