import React from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import { setSize } from '@chainplatform/layout';
import { chartStyles, dynamicChartStyles } from './styles/chartStyles';

const ChartTooltip = ({
    tooltip,
    valueText,
    offsetX,
    offsetY,
}) => {
    if (!tooltip) return null;

    return (
        <View
            pointerEvents="none"
            style={[
                chartStyles.tooltipContainer,
                dynamicChartStyles.tooltipPosition(tooltip, offsetX, offsetY),
            ]}
        >
            <View style={chartStyles.tooltipHeader}>
                <View style={[chartStyles.tooltipDot, dynamicChartStyles.tooltipDotColor(tooltip.color)]} />
                <Text numberOfLines={1} style={chartStyles.tooltipLabel}>
                    {tooltip.label}
                </Text>
            </View>

            <Text style={chartStyles.tooltipValue}>
                {valueText || tooltip.value}
            </Text>
            <View style={chartStyles.tooltipArrow} />
        </View>
    );
};

ChartTooltip.propTypes = {
    tooltip: PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number,
        label: PropTypes.string,
        value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        color: PropTypes.string,
    }),
    valueText: PropTypes.string,
    offsetX: PropTypes.number,
    offsetY: PropTypes.number,
};

ChartTooltip.defaultProps = {
    tooltip: null,
    valueText: '',
    offsetX: setSize(35),
    offsetY: setSize(78),
};

export default ChartTooltip;