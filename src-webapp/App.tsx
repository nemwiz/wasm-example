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
import PerformanceTable from './components/shared/PerformanceTable';
import {PerformanceScore} from './model/performance-score';


const App = () => {

    const [wasmModule, setWasmModule] = useState<any>(undefined);
    const [performanceScores, setPerformanceScores] = useState<PerformanceScore[]>([]);

    useEffect(() => {
        import('../pkg/wasm_example').then((module: any) => {
            setWasmModule(module);
        })
    }, []);

    const addPerformanceScore = (performanceScore: PerformanceScore) => {
        const newScores = [...performanceScores, performanceScore]
            .sort(((a, b) => a.time - b.time));
        setPerformanceScores(newScores)
    };

    return (
        wasmModule ? <div className={'main-container'}>
            <div className={'navigation'}>
                <button className={'navigate-button go-to-home-button'} onClick={() => {
                    navigate(Routes.HOME)
                }}>Back to home page
                </button>
            </div>

            <PerformanceTable performanceScores={performanceScores}/>

            <div className={'page-container'}>
                <Router>
                    <Home path={'/'}/>
                    <CsvWithJs path={Routes.CSV_WITH_JS} wasmModule={wasmModule} performanceScoreCallback={addPerformanceScore}/>
                    <CsvWithRust1 path={Routes.CSV_WITH_RUST_1} wasmModule={wasmModule} performanceScoreCallback={addPerformanceScore}/>
                    <CsvWithRust2 path={Routes.CSV_WITH_RUST_2} wasmModule={wasmModule} performanceScoreCallback={addPerformanceScore}/>
                    <CsvWithRust3 path={Routes.CSV_WITH_RUST_3} wasmModule={wasmModule} performanceScoreCallback={addPerformanceScore}/>
                    <Compressor path={Routes.COMPRESSOR} wasmModule={wasmModule}/>
                </Router>
            </div>
        </div> : <div>Loading WASM module...</div>
    )
}

export default App;
