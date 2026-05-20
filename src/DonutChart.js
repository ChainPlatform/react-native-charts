import React, { PureComponent } from 'react';
import { View, Platform } from 'react-native';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';
import PropTypes from 'prop-types';
import ChartTooltip from './ChartTooltip';
import { setSize } from '@chainplatform/layout';
import { chartStyles } from './styles/chartStyles';

class DonutChart extends PureComponent {
    static propTypes = {
        data: PropTypes.arrayOf(
            PropTypes.shape({
                label: PropTypes.string,
                value: PropTypes.number,
                color: PropTypes.string,
                total: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            })
        ).isRequired,
        size: PropTypes.number,
        strokeWidth: PropTypes.number,
        startAngle: PropTypes.number,
        segmentGap: PropTypes.number,
        backgroundColor: PropTypes.string,
        showPercent: PropTypes.bool,
        showInnerLabels: PropTypes.bool,
        percentFontSize: PropTypes.number,
        labelFontSize: PropTypes.number,
        contentFontSize: PropTypes.number,
        percentColor: PropTypes.string,
        centerContent: PropTypes.string,
        innerOffset: PropTypes.number,
        enableTooltip: PropTypes.bool,
    };

    static defaultProps = {
        size: setSize(320),
        strokeWidth: setSize(70),
        startAngle: -90,
        segmentGap: 2,
        backgroundColor: '#ECECEC',
        showPercent: true,
        showInnerLabels: true,
        percentFontSize: setSize(18),
        labelFontSize: setSize(15),
        contentFontSize: setSize(18),
        percentColor: '#FFFFFF',
        centerContent: '',
        innerOffset: setSize(24),
        enableTooltip: true,
    };

    constructor(props) {
        super(props);
        this.state = { tooltip: null };
    }

    polarToCartesian = (cx, cy, radius, angle) => {
        const rad = ((angle - 90) * Math.PI) / 180;
        return {
            x: cx + radius * Math.cos(rad),
            y: cy + radius * Math.sin(rad),
        };
    };

    describeArc = (cx, cy, radius, startAngle, endAngle) => {
        const start = this.polarToCartesian(cx, cy, radius, endAngle);
        const end = this.polarToCartesian(cx, cy, radius, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

        return [
            'M',
            start.x,
            start.y,
            'A',
            radius,
            radius,
            0,
            largeArcFlag,
            0,
            end.x,
            end.y,
        ].join(' ');
    };

    showTooltip = (item, percent, point) => {
        this.setState({
            tooltip: {
                x: point.x,
                y: point.y,
                label: item.label,
                value: item.total ?? item.value,
                percent,
                color: item.color,
            },
        });
    };

    hideTooltip = () => { this.setState({ tooltip: null }); };

    renderSegment = ({ item, index, center, radius, strokeWidth, segmentStartAngle, segmentEndAngle, sweepAngle, roundedPercent, percentPoint, arcPath }) => {
        const eventProps = {
            onPress: Platform.OS !== 'web' && this.props.enableTooltip ? () => this.showTooltip(item, roundedPercent, percentPoint) : undefined,
            onPressOut: Platform.OS !== 'web' ? this.hideTooltip : undefined,
            onMouseEnter: Platform.OS === 'web' && this.props.enableTooltip ? () => this.showTooltip(item, roundedPercent, percentPoint) : undefined,
            onMouseLeave: Platform.OS === 'web' ? this.hideTooltip : undefined,
        };

        if (sweepAngle >= 359.99) {
            return (
                <Circle
                    key={`segment-full-${index}`}
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke={item.color}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeLinecap="butt"
                    {...eventProps}
                />
            );
        }

        if (segmentEndAngle <= segmentStartAngle) return null;

        return (
            <Path
                key={`segment-path-${index}`}
                d={arcPath}
                stroke={item.color}
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeLinecap="butt"
                {...eventProps}
            />
        );
    };

    render() {
        const {
            data,
            size,
            strokeWidth,
            startAngle,
            segmentGap,
            backgroundColor,
            showPercent,
            showInnerLabels,
            percentFontSize,
            labelFontSize,
            contentFontSize,
            percentColor,
            centerContent,
            innerOffset,
            enableTooltip,
        } = this.props;

        const { tooltip } = this.state;

        if (!data?.length) return null;

        const validData = data.filter(item => Number(item?.value) > 0);

        if (!validData.length) return null;

        const total = validData.reduce((sum, item) => sum + Number(item.value || 0), 0);

        if (total <= 0) return null;

        const radius = (size - strokeWidth) / 2;
        const center = size / 2;

        let currentAngle = startAngle;

        return (
            <View style={chartStyles.centerRelative}>
                <Svg width={size} height={size}>
                    <Circle cx={center} cy={center} r={radius} stroke={backgroundColor} strokeWidth={strokeWidth} fill="transparent" />

                    {validData.map((item, index) => {
                        const value = Number(item.value || 0);
                        const percent = value / total;
                        const sweepAngle = percent * 360;
                        const isFullCircle = sweepAngle >= 359.99;
                        const gap = isFullCircle ? 0 : segmentGap;
                        const segmentStartAngle = currentAngle + gap / 2;
                        const segmentEndAngle = currentAngle + sweepAngle - gap / 2;
                        const middleAngle = currentAngle + sweepAngle / 2;

                        currentAngle += sweepAngle;

                        const arcPath = this.describeArc(center, center, radius, segmentStartAngle, segmentEndAngle);
                        const percentPoint = this.polarToCartesian(center, center, radius, middleAngle);
                        const innerPoint = this.polarToCartesian(center, center, radius - strokeWidth / 2 - innerOffset, middleAngle);
                        const roundedPercent = Math.round(percent * 100);

                        return (
                            <React.Fragment key={`segment-${index}`}>
                                {this.renderSegment({
                                    item,
                                    index,
                                    center,
                                    radius,
                                    strokeWidth,
                                    segmentStartAngle,
                                    segmentEndAngle,
                                    sweepAngle,
                                    roundedPercent,
                                    percentPoint,
                                    arcPath,
                                })}

                                {showPercent && (
                                    <SvgText x={percentPoint.x} y={percentPoint.y} fill={percentColor} fontSize={percentFontSize} fontWeight="600" textAnchor="middle" alignmentBaseline="middle">
                                        {`${roundedPercent}%`}
                                    </SvgText>
                                )}

                                {showInnerLabels && !!item.label && (
                                    <SvgText x={innerPoint.x} y={innerPoint.y} fill={item.color} fontSize={labelFontSize} textAnchor="middle" alignmentBaseline="middle">
                                        {item.label}
                                    </SvgText>
                                )}
                            </React.Fragment>
                        );
                    })}

                    {!!centerContent && (
                        <SvgText x={center} y={center} fontSize={contentFontSize} fontWeight="600" fill="#333" textAnchor="middle" alignmentBaseline="middle">
                            {centerContent}
                        </SvgText>
                    )}
                </Svg>

                {enableTooltip ? <ChartTooltip tooltip={tooltip} valueText={tooltip ? `${tooltip.value} (${tooltip.percent}%)` : ''} /> : null}
            </View>
        );
    }
}

export default DonutChart;