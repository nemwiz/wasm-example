import React, {FC} from 'react';
import {Chart} from 'react-google-charts';

interface BarChartProps {
    data: object[];
    label: string;
}

const BarChart: FC<BarChartProps> = (({data, label}) => {
    return (
        <div className={'bar-chart-container'}>
            <Chart
                width={'80%'}
                height={'300px'}
                chartType='Bar'
                loader={<div>Loading Chart...</div>}
                data={data}
                options={{
                    legend: {position: 'none'},
                    chart: {
                        title: `Top ten countries by ${label}`,
                    },
                }}
            />
        </div>
    );
});

export default BarChart;
