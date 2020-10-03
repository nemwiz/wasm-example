import {RouteComponentProps} from '@reach/router';

export interface WasmComponentProps extends RouteComponentProps {
    wasmModule: any;
}
