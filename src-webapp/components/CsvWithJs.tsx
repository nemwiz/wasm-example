import React, {FC, Fragment, RefObject, useState} from 'react';
import {WasmComponentProps} from '../model/wasm-component-props';
import Papa from 'papaparse';
import {nest} from 'd3-collection';
import {sum} from 'd3-array';
import FileInput from './shared/FileInput';
import {SalesRecord} from '../model/sales-record';
import BarChart from './shared/BarChart';

const CsvWithJs: FC<WasmComponentProps> = (({performanceScoreCallback, itemType}) => {
    const [countryData, setCountryData] = useState<object[]>([]);

    const processCsvFile = async (inputElement: RefObject<HTMLInputElement>) => {

        const file = await inputElement.current.files[0];

        const t1 = performance.now();

        const text = await file.text();
        const parsedText = Papa.parse(text, {header: true, dynamicTyping: false});

        const summarizedData = nest()
            .key((data: SalesRecord) => {
                return data.country
            })
            .key((data: SalesRecord) => {
                return data.item_type
            })
            .rollup((data: SalesRecord[]) => {
                return sum(data, (data: SalesRecord) => data.units_sold) as undefined
            })
            .entries(parsedText.data)
            .map(data => {
                const dataPoint = data.values.filter((d: { key: string }) => d.key === itemType)[0];
                return {country: data.key, units_sold: dataPoint === undefined ? 0 : dataPoint.value}
            })
            .sort((a, b) => {
                if (a.units_sold > b.units_sold) {
                    return -1;
                } else if (a.units_sold < b.units_sold) {
                    return 1;
                } else {
                    return 0;
                }
            });

        const t2 = performance.now();
        performanceScoreCallback({
            time: parseFloat((t2 - t1).toFixed(0)),
            description: 'CSV processing in JS'
        });


        const data = [
            ['Country', itemType],
            ...summarizedData.slice(0, 9).map(value => [value.country, value.units_sold])
        ];

        setCountryData(data);
    };

    return (
        <Fragment>
            <FileInput onFileRead={processCsvFile}/>
            {countryData.length !== 0 ? <BarChart data={countryData} label={itemType}/> : null}
        </Fragment>
    );
});

export default CsvWithJs;
