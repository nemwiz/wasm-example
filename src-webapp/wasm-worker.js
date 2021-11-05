import {threads} from 'wasm-feature-detect';
import * as Comlink from 'comlink';

async function initializeMultithreading() {
    const multiThreadModule = await Promise.resolve(
        (async () => {
            // If threads are unsupported in this browser, skip this handler.
            if (!(await threads())) return;
            const module = await import('/pkg/wasm_example.js');
            await module.default();
            await module.initThreadPool(navigator.hardwareConcurrency);
            return module;
        })()
    );

    return Comlink.proxy({
        supportsThreads: !!multiThreadModule,
        multiThreadModule: multiThreadModule
    });
}

Comlink.expose({
    multiThreadWasmModule: initializeMultithreading()
});