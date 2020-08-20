import React from 'react';

import {navigate, Router} from '@reach/router';
import JSLand from './components/JSLand';
import RustLand from './components/RustLand';
import './App.css';


let wasm: any;

import('../pkg/wasm_example').then(module => {
    wasm = module;
})
const App = () => {
    return (
        <div className={'main-container'}>
            <div className={'navigation'}>
                <button className={'navigate-button'} onClick={() => {
                    navigate(`/js-land`)
                }}>Take me to JS land
                </button>
                <button className={'navigate-button'} onClick={() => {
                    navigate(`/rust-land`)
                }}>Take me to Rust land
                </button>
            </div>

            <div className={'page-container'}>
                <Router>
                    <JSLand path="/js-land"/>
                    <RustLand path="/rust-land"/>
                </Router>
            </div>
        </div>
    )
}

export default App;
