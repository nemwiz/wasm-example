import React, {FC, RefObject} from 'react';
// @ts-ignore
import * as Comlink from 'comlink';
import {WasmComponentProps} from '../model/wasm-component-props';
import FileInput from './shared/FileInput';


const Multithreading: FC<WasmComponentProps> = ({wasmModule, performanceScoreCallback, itemType}) => {

    const processCsvFileWithMultiThreading = async (inputElement: RefObject<HTMLInputElement>) => {
        async function setUpWorkerForMultithreading() {
            const wasmModule = await Comlink.wrap(new Worker(new URL('../wasm-worker.js', import.meta.url), {
                type: 'module'
            })).multiThreadWasmModule;

            const multiThreadModule = wasmModule['multiThreadModule'];

            const file = await inputElement.current.files[0];

            const t1 = performance.now();

            const csvTextAsBytes = new Uint8Array(await file.arrayBuffer());

            const store = await multiThreadModule.process_records_from_csv_text_as_bytes(csvTextAsBytes, itemType);

            console.log(store)

            const t2 = performance.now();
            performanceScoreCallback({
                time: parseFloat((t2 - t1).toFixed(0)),
                description: 'CSV processing in Rust with multithreading'
            });
        }

        await setUpWorkerForMultithreading();
    }

    return (
        <div>
            <FileInput onFileRead={async (file) => {
                await processCsvFileWithMultiThreading(file);
            }}/>
        </div>
    )
}

export default Multithreading;