import React, {FC} from "react";
import {WasmComponentProps} from '../model/wasm-component-props';
import FileInput from './shared/FileInput';

const CsvWithRust2: FC<WasmComponentProps> = (({wasmModule}) => {

    const processCsvFile = async (inputElement: any) => {

        const file = await inputElement.current.files[0];

        const logMessage = 'CSV processing with storage in Rust';
        console.time(logMessage);

        const salesRecordStore = wasmModule.SalesRecordStore.new();
        salesRecordStore.process_records_from_csv_text_as_string(await file.text());
        const values = salesRecordStore.get_top_ten_items_by_country('Meat');
        console.log(values);

        console.timeEnd(logMessage);
    }

    return (
        <FileInput onFileRead={processCsvFile}/>
    );
});

export default CsvWithRust2;
