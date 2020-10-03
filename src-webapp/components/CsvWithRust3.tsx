import React, {FC} from "react";
import {WasmComponentProps} from '../model/wasm-component-props';
import FileInput from './shared/FileInput';

const CsvWithRust3: FC<WasmComponentProps> = (({wasmModule, performanceScoreCallback}) => {

    const processCsvFile = async (inputElement: any) => {

        const file = await inputElement.current.files[0];

        const t1 = performance.now();

        const csvTextAsBytes = new Uint8Array(await file.arrayBuffer());
        const salesRecordStore = wasmModule.SalesRecordStore.new();
        salesRecordStore.process_records_from_csv_text_as_bytes(csvTextAsBytes);
        const values = salesRecordStore.get_top_ten_items_by_country('Meat');

        const t2 = performance.now();
        performanceScoreCallback({
            time: parseFloat((t2 - t1).toFixed(0)),
            description: 'CSV processing in Rust with bytes array'
        });
    }

    return (
        <FileInput onFileRead={processCsvFile}/>
    );
});

export default CsvWithRust3;
