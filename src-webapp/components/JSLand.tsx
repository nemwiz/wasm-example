import React, {FC, Fragment, useState} from "react";
import {RouteComponentProps} from '@reach/router';
import Papa from 'papaparse';
import {nest} from 'd3-collection';
import {sum} from 'd3-array';
import FileInput from '../FileInput';
// @ts-ignore
import {BarChart} from 'react-d3-components';

interface JSLandProps extends RouteComponentProps {

}

const JSLand: FC<JSLandProps> = (() => {

    const [countryData, setCountryData] = useState<any>([]);

    const processCsvFile = async (inputElement: any) => {

        const file = await inputElement.current.files[0];

        const t1 = performance.now();

        console.log('CSV processing JS started...')

        const text = await file.text();
        const parsedText = Papa.parse(text, {header: true, dynamicTyping: true});

        const t3 = performance.now();
        console.log(`CSV processing JS took ${t3 - t1} milliseconds.`);

        const summarizedData = nest()
            .key((data: any) => data.country)
            .key((data: any) => data.itemType)
            .rollup((data: any) => {
                return sum(data, (data: any) => data.unitsSold) as any
            })
            .entries(parsedText.data)
            .map(data => {
                const v = data.values.filter((d: any) => d.key === 'Cosmetics')[0];
                return {x: data.key, y: v === undefined ? 0 : v.value}
            })
            .sort((a, b) => {
                if (a.y > b.y) {
                    return -1;
                } else if (a.y < b.y) {
                    return 1;
                } else {
                    return 0;
                }
            });

        // const t2 = performance.now();
        // console.log(`CSV processing JS took ${t2 - t1} milliseconds.`);

        setCountryData([{
            label: 'Cosmetics by country',
            values: summarizedData.slice(0, 9)
        }]);

    };

    return (
        <Fragment>
            <FileInput onFileRead={processCsvFile}/>
            {countryData.length !== 0 ? <BarChart data={countryData}
                                                  width={800}
                                                  height={400}
                                                  margin={{top: 10, bottom: 50, left: 5, right: 5}}/> : null}
        </Fragment>
    );
});

export default JSLand;
