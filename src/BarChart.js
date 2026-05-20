import React, { PureComponent } from 'react';
import { View, Platform, ScrollView } from 'react-native';
import Svg, { Rect, Text as SvgText, Line } from 'react-native-svg';
import PropTypes from 'prop-types';
import { setSize } from '@chainplatform/layout';
import ChartTooltip from './ChartTooltip';
import { chartStyles, dynamicChartStyles } from './styles/chartStyles';
import { px } from './utils';

class BarChart extends PureComponent {
    chartColors = [
        '#93C5FD', '#3B82F6', '#1E40AF', '#0EA5E9', '#0369A1',
        '#C4B5FD', '#8B5CF6', '#7C3AED', '#A855F7', '#6D28D9',
        '#6EE7B7', '#10B981', '#059669', '#34D399', '#047857',
        '#F87171', '#EF4444', '#DC2626', '#FB923C', '#FACC15',
    ];

    constructor(props) {
        super(props);

        this.state = {
            tooltip: null,
            containerWidth: 0,
        };
    }

    showTooltip = (e, dataIndex, value, color) => {
        const { locationX, locationY } = e.nativeEvent;

        const label =
            this.props.barLabels?.[dataIndex] ||
            this.props.categories?.[dataIndex] ||
            `Bar ${dataIndex}`;

        this.setState({
            tooltip: {
                x: locationX,
                y: locationY,
                dataIndex,
                value,
                label,
                color,
            },
        });
    };

    hideTooltip = () => { this.setState({ tooltip: null }); };

    renderSingleBar = (
        dataIndex,
        value,
        chartHeight,
        maxValue,
        x,
        barWidth,
        color,
        enableTooltip
    ) => {
        if (!value || value <= 0) return null;

        const barHeight =
            (value / maxValue) *
            (chartHeight - setSize(25));

        const y = chartHeight - barHeight;

        return (
            <Rect
                key={`bar-${dataIndex}`}
                x={px(x)}
                y={px(y)}
                width={barWidth}
                height={barHeight}
                fill={color}
                rx={setSize(4)}
                ry={setSize(4)}
                onMouseEnter={
                    Platform.OS === 'web'
                        ? e =>
                            this.showTooltip(
                                e,
                                dataIndex,
                                value,
                                color
                            )
                        : undefined
                }
                onMouseLeave={
                    Platform.OS === 'web'
                        ? this.hideTooltip
                        : undefined
                }
                onPress={
                    Platform.OS !== 'web' && enableTooltip
                        ? e =>
                            this.showTooltip(
                                e,
                                dataIndex,
                                value,
                                color
                            )
                        : undefined
                }
                onPressOut={
                    Platform.OS !== 'web' && enableTooltip
                        ? this.hideTooltip
                        : undefined
                }
            />
        );
    };

    render() {
        const {
            data,
            categories,
            chartHeight,
            showGrid,
            gridColor,
            axisLabelColor,
            axisLabelSizeMax,
            axisLabelSizeMin,
            tooltipFontSize,
            axisLabelPadding,
            barSpacing,
            colors: customColors,
            barWidth,
            theme,
            enableTooltip = false
        } = this.props;

        const {
            tooltip,
            containerWidth,
        } = this.state;

        if (!data?.length) return null;

        const maxValue = Math.max(...data);

        if (maxValue <= 0) return null;

        const colors = data.map((_, index) => (
            customColors?.[index] ||
            this.chartColors[index % this.chartColors.length]
        ));

        const leftPadding = setSize(20);
        const rightPadding = setSize(20);

        const fixedBarsWidth = data.length * barWidth;

        const minimumRequiredWidth =
            fixedBarsWidth +
            (data.length - 1) * barSpacing +
            leftPadding +
            rightPadding;

        const isExpanded = containerWidth > minimumRequiredWidth;

        const svgWidth = isExpanded ? containerWidth : minimumRequiredWidth;

        const dynamicSpacing =
            data.length > 1
                ? isExpanded
                    ? (
                        svgWidth -
                        fixedBarsWidth -
                        leftPadding -
                        rightPadding
                    ) / (data.length - 1)
                    : barSpacing
                : 0;

        const totalChartHeight = chartHeight - setSize(30);

        const gridSteps = 5;
        const stepHeight = totalChartHeight / gridSteps;

        return (<View style={chartStyles.relativeFullWidth} onLayout={e => { this.setState({ containerWidth: e.nativeEvent.layout.width }); }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={dynamicChartStyles.minWidth(svgWidth)} >
                <Svg width={svgWidth} height={chartHeight} >
                    <Line
                        x1={px(0)}
                        y1={px(0)}
                        x2={px(0)}
                        y2={px(totalChartHeight)}
                        stroke={theme?.colors?.border || '#888'}
                        strokeWidth={setSize(1)}
                    />

                    <Line
                        x1={px(0)}
                        y1={px(totalChartHeight)}
                        x2={px(svgWidth)}
                        y2={px(totalChartHeight)}
                        stroke={theme?.colors?.border || '#888'}
                        strokeWidth={setSize(1)}
                    />

                    {showGrid &&
                        Array.from({
                            length: gridSteps + 1,
                        }).map((_, i) => {
                            const y =
                                totalChartHeight -
                                i * stepHeight;

                            return (
                                <Line
                                    key={`grid-${i}`}
                                    x1={px(0)}
                                    y1={px(y)}
                                    x2={px(svgWidth)}
                                    y2={px(y)}
                                    stroke={gridColor}
                                    strokeWidth={setSize(1)}
                                />
                            );
                        })}

                    {data.map((value, dataIndex) => {
                        const x =
                            leftPadding +
                            dataIndex *
                            (
                                barWidth +
                                dynamicSpacing
                            );

                        const barHeight =
                            (value / maxValue) *
                            (
                                totalChartHeight -
                                setSize(25)
                            );

                        return (
                            <React.Fragment
                                key={`bar-group-${dataIndex}`}
                            >
                                {this.renderSingleBar(
                                    dataIndex,
                                    value,
                                    totalChartHeight,
                                    maxValue,
                                    x,
                                    barWidth,
                                    colors[dataIndex],
                                    enableTooltip
                                )}

                                {value > 0 && (
                                    <SvgText
                                        x={x + barWidth / 2}
                                        y={
                                            totalChartHeight -
                                            barHeight -
                                            setSize(8)
                                        }
                                        fontSize={tooltipFontSize}
                                        fill={
                                            theme?.colors?.text ||
                                            '#000'
                                        }
                                        fontWeight="600"
                                        textAnchor="middle"
                                    >
                                        {value}
                                    </SvgText>
                                )}
                            </React.Fragment>
                        );
                    })}

                    {categories?.map((label, idx) => {
                        const x =
                            leftPadding +
                            idx *
                            (
                                barWidth +
                                dynamicSpacing
                            ) +
                            barWidth / 2;

                        return (
                            <SvgText
                                key={`label-${idx}`}
                                x={x}
                                y={
                                    totalChartHeight +
                                    axisLabelPadding
                                }
                                fontSize={
                                    label.length >= 6
                                        ? axisLabelSizeMin
                                        : axisLabelSizeMax
                                }
                                fill={axisLabelColor}
                                textAnchor="middle"
                            >
                                {label}
                            </SvgText>
                        );
                    })}
                </Svg>
            </ScrollView>
            {enableTooltip ? <ChartTooltip tooltip={tooltip} valueText={tooltip ? String(tooltip.value) : ''} /> : null}
        </View>);
    }
}

BarChart.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.number
    ).isRequired,
    categories: PropTypes.arrayOf(
        PropTypes.string
    ),
    chartHeight: PropTypes.number,
    showGrid: PropTypes.bool,
    gridColor: PropTypes.string,
    axisLabelColor: PropTypes.string,
    axisLabelSizeMin: PropTypes.number,
    axisLabelSizeMax: PropTypes.number,
    tooltipFontSize: PropTypes.number,
    axisLabelPadding: PropTypes.number,
    barSpacing: PropTypes.number,
    colors: PropTypes.arrayOf(
        PropTypes.string
    ),
    barLabels: PropTypes.arrayOf(
        PropTypes.string
    ),
    barWidth: PropTypes.number,
    theme: PropTypes.object,
};

BarChart.defaultProps = {
    categories: [],
    chartHeight: setSize(220),
    showGrid: true,
    gridColor: '#ddd',
    axisLabelColor: '#666',
    axisLabelSizeMax: setSize(13),
    axisLabelSizeMin: setSize(7),
    tooltipFontSize: setSize(13),
    axisLabelPadding: setSize(18),
    barSpacing: setSize(12),
    barWidth: setSize(25),
    colors: [
        '#3B82F6',
        '#8B5CF6',
        '#10B981',
        '#EF4444',
    ],
    barLabels: [],
    theme: null,
};

export default BarChart;