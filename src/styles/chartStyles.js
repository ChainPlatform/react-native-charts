import { StyleSheet } from 'react-native';
import { setSize } from '@chainplatform/layout';

export const chartStyles = StyleSheet.create({
    relativeFullWidth: {
        width: '100%',
        position: 'relative',
    },
    centerRelative: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    tooltipContainer: {
        position: 'absolute',
        backgroundColor: '#111827',
        borderRadius: setSize(12),
        paddingHorizontal: setSize(12),
        paddingVertical: setSize(10),
        minWidth: setSize(95),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: setSize(6) },
        shadowOpacity: 0.25,
        shadowRadius: setSize(12),
        elevation: 8,
        borderWidth: setSize(1),
        borderColor: 'rgba(255,255,255,0.08)',
        zIndex: 999,
    },
    tooltipHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: setSize(5),
    },
    tooltipDot: {
        width: setSize(10),
        height: setSize(10),
        borderRadius: 999,
        marginRight: setSize(5),
    },
    tooltipLabel: {
        color: '#D1D5DB',
        fontSize: setSize(12),
        fontWeight: '500',
        maxWidth: setSize(120),
    },
    tooltipValue: {
        color: '#FFF',
        fontSize: setSize(14),
        fontWeight: '700',
    },
    tooltipArrow: {
        position: 'absolute',
        bottom: -setSize(6),
        left: '50%',
        marginLeft: -setSize(6),
        width: setSize(12),
        height: setSize(12),
        backgroundColor: '#111827',
        transform: [{ rotate: '45deg' }],
        borderRightWidth: setSize(1),
        borderBottomWidth: setSize(1),
        borderColor: 'rgba(255,255,255,0.08)',
    },
});

export const dynamicChartStyles = {
    minWidth: minWidth => ({ minWidth }),
    tooltipPosition: (tooltip, offsetX, offsetY) => ({
        left: Math.max(tooltip.x - offsetX, 10),
        top: Math.max(tooltip.y - offsetY, 10),
    }),
    tooltipDotColor: color => ({ backgroundColor: color }),
    lineChartRoot: (width, height, backgroundColor) => ({
        width,
        height,
        backgroundColor,
        position: 'relative',
    }),
};
