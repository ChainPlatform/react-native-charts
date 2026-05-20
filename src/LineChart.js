import React, { PureComponent } from 'react';
import { View, Platform } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import PropTypes from 'prop-types';
import { setSize } from '@chainplatform/layout';
import ChartTooltip from './ChartTooltip';
import { dynamicChartStyles } from './styles/chartStyles';
import { px } from './utils';

class LineChart extends PureComponent {
    state = { tooltip: null };

    showTooltip = (e, point, index) => {
        const { locationX, locationY } = e.nativeEvent;
        const label = this.props.labels?.[index] || this.props.data?.[index] || `P ${index + 1}`;
        this.setState({ tooltip: { x: locationX, y: locationY, value: point.value, label, color: this.props.strokeColor } });
    };

    hideTooltip = () => this.setState({ tooltip: null });

    getSmoothPath = points => {
        if (!points.length) return '';
        let d = `M ${px(points[0].x)} ${px(points[0].y)}`;
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i];
            const p1 = points[i + 1];
            const midX = (p0.x + p1.x) / 2;
            d += ` C ${px(midX)} ${px(p0.y)}, ${px(midX)} ${px(p1.y)}, ${px(p1.x)} ${px(p1.y)}`;
        }
        return d;
    };

    render() {
        const { enableTooltip, data, width, height, fillColor, strokeColor, strokeWidth, showDots, dotRadius, touchRadius, paddingHorizontal, paddingVertical, backgroundColor } = this.props;
        const { tooltip } = this.state;

        if (!data?.length) return null;

        const maxValue = Math.max(...data);
        const minValue = Math.min(...data);
        const chartWidth = width - paddingHorizontal * 2;
        const chartHeight = height - paddingVertical * 2;
        const range = maxValue - minValue || 1;

        const points = data.map((value, index) => ({
            x: paddingHorizontal + (data.length === 1 ? chartWidth / 2 : index * (chartWidth / (data.length - 1))),
            y: paddingVertical + chartHeight - ((value - minValue) / range) * chartHeight,
            value,
        }));

        const linePath = this.getSmoothPath(points);
        const areaPath = `${linePath} L ${px(points[points.length - 1].x)} ${px(height - paddingVertical)} L ${px(points[0].x)} ${px(height - paddingVertical)} Z`;

        return (
            <View style={dynamicChartStyles.lineChartRoot(width, height, backgroundColor)}>
                <Svg width={width} height={height}>
                    <Defs>
                        <LinearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0" stopColor={strokeColor} stopOpacity="0.25" />
                            <Stop offset="1" stopColor={strokeColor} stopOpacity="0" />
                        </LinearGradient>
                    </Defs>

                    <Path d={areaPath} fill="url(#lineGradient)" />
                    <Path d={linePath} fill="none" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />

                    {points.map((point, index) => (
                        <React.Fragment key={`point-${index}`}>
                            {showDots && <Circle cx={point.x} cy={point.y} r={dotRadius} fill={fillColor} stroke={strokeColor} strokeWidth={setSize(2)} />}
                            <Circle
                                cx={point.x}
                                cy={point.y}
                                r={touchRadius}
                                fill="transparent"
                                onMouseEnter={Platform.OS === 'web' && enableTooltip ? e => this.showTooltip(e, point, index) : undefined}
                                onMouseLeave={Platform.OS === 'web' ? this.hideTooltip : undefined}
                                onPress={Platform.OS !== 'web' && enableTooltip ? e => this.showTooltip(e, point, index) : undefined}
                                onPressOut={Platform.OS !== 'web' ? this.hideTooltip : undefined}
                            />
                        </React.Fragment>
                    ))}
                </Svg>

                {enableTooltip ? <ChartTooltip tooltip={tooltip} valueText={tooltip ? String(tooltip.value) : ''} /> : null}
            </View>
        );
    }
}

LineChart.propTypes = {
    data: PropTypes.arrayOf(PropTypes.number).isRequired,
    labels: PropTypes.arrayOf(PropTypes.string),
    width: PropTypes.number,
    height: PropTypes.number,
    strokeColor: PropTypes.string,
    fillColor: PropTypes.string,
    strokeWidth: PropTypes.number,
    showDots: PropTypes.bool,
    dotRadius: PropTypes.number,
    touchRadius: PropTypes.number,
    paddingHorizontal: PropTypes.number,
    paddingVertical: PropTypes.number,
    backgroundColor: PropTypes.string,
    enableTooltip: PropTypes.bool,
};

LineChart.defaultProps = {
    labels: [],
    width: setSize(160),
    height: setSize(60),
    strokeColor: '#5B7CFA',
    fillColor: '#FFFFFF',
    strokeWidth: setSize(2),
    showDots: true,
    dotRadius: setSize(3),
    touchRadius: setSize(10),
    paddingHorizontal: setSize(10),
    paddingVertical: setSize(8),
    backgroundColor: 'transparent',
    enableTooltip: true,
};

export default LineChart;