import React, {FC, RefObject, useState} from 'react';
import {WasmComponentProps} from '../model/wasm-component-props';
import FileInput from './shared/FileInput';
import BarChart from './shared/BarChart';

const CsvWithRust2: FC<WasmComponentProps> = (({wasmModule, performanceScoreCallback, itemType}) => {

    const [countryData, setCountryData] = useState<object[]>([]);

    const processCsvFile = async (inputElement: RefObject<HTMLInputElement>) => {

        const file = await inputElement.current.files[0];

        const t1 = performance.now();

        const salesRecordStore = wasmModule.SalesRecordStore.new();
        salesRecordStore.process_records_from_csv_text_as_string(await file.text());
        const summarizedData = salesRecordStore.get_top_ten_items_by_country(itemType);

        const t2 = performance.now();
        performanceScoreCallback({
            time: parseFloat((t2 - t1).toFixed(0)),
            description: 'CSV processing in Rust with text string'
        });

        setCountryData([
            ['Country', itemType],
            ...summarizedData
        ]);
    }

    return (
        <>
            <FileInput onFileRead={processCsvFile}/>
            {countryData.length !== 0 ? <BarChart data={countryData} label={itemType}/> : null}
        </>
    );
});

export default CsvWithRust2;
