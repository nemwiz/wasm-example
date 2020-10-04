import React, {FC, RefObject, useState} from 'react';
import {WasmComponentProps} from '../model/wasm-component-props';
import FileInput from './shared/FileInput';
import BarChart from './shared/BarChart';

const CsvWithRust3: FC<WasmComponentProps> = (({wasmModule, performanceScoreCallback, itemType}) => {

    const [countryData, setCountryData] = useState<object[]>([]);

    const processCsvFile = async (inputElement: RefObject<HTMLInputElement>) => {

        const file = await inputElement.current.files[0];

        const t1 = performance.now();

        const csvTextAsBytes = new Uint8Array(await file.arrayBuffer());
        const salesRecordStore = wasmModule.SalesRecordStore.new();
        salesRecordStore.process_records_from_csv_text_as_bytes(csvTextAsBytes);
        const summarizedData = salesRecordStore.get_top_ten_items_by_country(itemType);

        const t2 = performance.now();
        performanceScoreCallback({
            time: parseFloat((t2 - t1).toFixed(0)),
            description: 'CSV processing in Rust with bytes array'
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

export default CsvWithRust3;
