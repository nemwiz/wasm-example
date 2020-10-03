import React, {FC} from "react";
import {WasmComponentProps} from '../model/wasm-component-props';
import FileInput from './shared/FileInput';

const CsvWithRust2: FC<WasmComponentProps> = (({wasmModule, performanceScoreCallback}) => {

    const processCsvFile = async (inputElement: any) => {

        const file = await inputElement.current.files[0];

        const t1 = performance.now();

        const salesRecordStore = wasmModule.SalesRecordStore.new();
        salesRecordStore.process_records_from_csv_text_as_string(await file.text());
        const values = salesRecordStore.get_top_ten_items_by_country('Meat');

        const t2 = performance.now();
        performanceScoreCallback({
            time: parseFloat((t2 - t1).toFixed(0)),
            description: 'CSV processing in Rust with text string'
        });
    }

    return (
        <FileInput onFileRead={processCsvFile}/>
    );
});

export default CsvWithRust2;
