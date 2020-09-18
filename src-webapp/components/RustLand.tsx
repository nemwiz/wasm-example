import React, {FC} from "react";
import {RouteComponentProps} from '@reach/router';
import FileInput from '../FileInput';

let wasm: any;

// TODO - find a nicer way to import this
import('../../pkg/wasm_example').then(module => {
    wasm = module;
})

interface RustLandProps extends RouteComponentProps {

}


const RustLand: FC<RustLandProps> = (() => {

    const processCsvFile = async (inputElement: any) => {

        const file = await inputElement.current.files[0];

        const logMessage = 'CSV processing with storage in Rust';
        console.time(logMessage);

        const textFromCsvFile = new Uint8Array(await file.arrayBuffer());
        const parsedDataStore = wasm.SalesRecordStore.new();
        parsedDataStore.parse_csv_and_store_records(textFromCsvFile);
        const values = parsedDataStore.get_top_ten_items_by_country('Meat');
        console.log(values);

        console.timeEnd(logMessage);
    }


    return (
        <FileInput onFileRead={processCsvFile}/>
    );
});

export default RustLand;
