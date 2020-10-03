import React, {useEffect, useState} from 'react';

import {navigate, Router} from '@reach/router';
import './App.css';
import Home from './components/Home';
import CsvWithJs from './components/CsvWithJs';
import CsvWithRust1 from './components/CsvWithRust1';
import CsvWithRust2 from './components/CsvWithRust2';
import CsvWithRust3 from './components/CsvWithRust3';
import Compressor from './components/Compressor';
import {Routes} from './components/shared/routes';


const App = () => {

    const [wasmModule, setWasmModule] = useState<any>(undefined);

    useEffect(() => {
        import('../pkg/wasm_example').then((module: any) => {
            setWasmModule(module);
        })
    }, []);

    return (
        wasmModule ? <div className={'main-container'}>
            <div className={'navigation'}>
                <button className={'navigate-button go-to-home-button'} onClick={() => {
                    navigate(Routes.HOME)
                }}>Back to home page
                </button>
            </div>

            <div className={'page-container'}>
                <Router>
                    <Home path={'/'}/>
                    <CsvWithJs path={Routes.CSV_WITH_JS} wasmModule={wasmModule}/>
                    <CsvWithRust1 path={Routes.CSV_WITH_RUST_1} wasmModule={wasmModule}/>
                    <CsvWithRust2 path={Routes.CSV_WITH_RUST_2} wasmModule={wasmModule}/>
                    <CsvWithRust3 path={Routes.CSV_WITH_RUST_3} wasmModule={wasmModule}/>
                    <Compressor path={Routes.COMPRESSOR} wasmModule={wasmModule}/>
                </Router>
            </div>
        </div> : <div>Loading WASM module...</div>
    )
}

export default App;
