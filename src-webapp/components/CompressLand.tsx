import React, {FC} from "react";
import FileInput from '../FileInput';

let wasm: any;

// TODO - find a nicer way to import this
import('../../pkg/wasm_example').then(module => {
    wasm = module;
})


const CompressLand: FC = (() => {
    // TODO - replace any typings
    const compressCsvFile = async (inputElement: any) => {

        const file = await inputElement.current.files[0];

        const logMessage = 'File compression in Rust';
        console.time(logMessage);

        const textFromCsvFile = new Uint8Array(await file.arrayBuffer());
        const compressedFile = wasm.compress(textFromCsvFile);

        console.timeEnd(logMessage);

        await fetch('http://localhost:8000/upload', {
            method: 'POST',
            body: compressedFile
        })
    }

    return (
        <FileInput onFileRead={compressCsvFile}/>
    );
});

export default CompressLand;
