import React, {FC, RefObject} from 'react';
import {WasmComponentProps} from '../model/wasm-component-props';
import FileInput from './shared/FileInput';


const Compressor: FC<WasmComponentProps> = (({wasmModule}) => {
    const compressCsvFile = async (inputElement: RefObject<HTMLInputElement>) => {

        const file = await inputElement.current.files[0];

        const textFromCsvFile = new Uint8Array(await file.arrayBuffer());
        const compressedFile = wasmModule.FileCompressor.compress(textFromCsvFile);

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
