import React, {FC} from "react";
import {WasmComponentProps} from '../model/wasm-component-props';
import Papa from "papaparse";
import FileInput from './shared/FileInput';

const CsvWithRust1: FC<WasmComponentProps> = (({wasmModule}) => {

    const processCsvFile = async (inputElement: any) => {

        const file = await inputElement.current.files[0];

        const logMessage = 'CSV processing with storage in Rust';
        console.time(logMessage);

        const textFromCsvFile = await file.text();
        const parsedText = Papa.parse(textFromCsvFile, {header: true, dynamicTyping: true});
        // removes first (headers) and last record from csv data
        parsedText.data.shift();
        parsedText.data.pop();

        const salesRecordStore = wasmModule.SalesRecordStore.new();
        const values = salesRecordStore.process_records_as_js_objects(parsedText.data, 'Meat');
        console.log(values);

        console.timeEnd(logMessage);
    }

    return (
        <FileInput onFileRead={processCsvFile}/>
    );
});

export default CsvWithRust1;
