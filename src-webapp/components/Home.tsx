import React, {FC} from 'react';
import {navigate, RouteComponentProps} from '@reach/router';
import {Routes} from './shared/routes';

const Home: FC<RouteComponentProps> = (() => {

    return (
        <div className={'navigate-buttons-container'}>
            <h1>Enterprise Web Assembly</h1>

            <button className={'navigate-button'} onClick={() => {
                navigate(Routes.CSV_WITH_JS)
            }}>Process CSV with JS</button>

            <button className={'navigate-button'} onClick={() => {
                navigate(Routes.CSV_WITH_RUST_1)
            }}>Process CSV with Rust 1</button>

            <button className={'navigate-button'} onClick={() => {
                navigate(Routes.CSV_WITH_RUST_2)
            }}>Process CSV with Rust 2</button>

            <button className={'navigate-button'} onClick={() => {
                navigate(Routes.CSV_WITH_RUST_3)
            }}>Process CSV with Rust 3</button>

            <button className={'navigate-button'} onClick={() => {
                navigate(Routes.COMPRESSOR)
            }}>Compressor</button>

            <button className={'navigate-button'} onClick={() => {
                navigate(Routes.MULTITHREADING)
            }}>Multithreading</button>

        </div>
    );
});

export default Home;
