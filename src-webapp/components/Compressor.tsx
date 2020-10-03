import React, {FC} from "react";
import {WasmComponentProps} from '../model/wasm-component-props';
import FileInput from './shared/FileInput';


const Compressor: FC<WasmComponentProps> = (({wasmModule}) => {
    // TODO - replace any typings
    const compressCsvFile = async (inputElement: any) => {

        const file = await inputElement.current.files[0];

        const logMessage = 'File compression in Rust';
        console.time(logMessage);

        const textFromCsvFile = new Uint8Array(await file.arrayBuffer());
        const compressor = wasmModule.Compressor.new();
        const compressedFile = compressor.compress(textFromCsvFile);

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

export default Compressor;
