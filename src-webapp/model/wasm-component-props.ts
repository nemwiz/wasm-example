import {RouteComponentProps} from '@reach/router';
import {PerformanceScore} from './performance-score';

export interface WasmComponentProps extends RouteComponentProps {
    wasmModule: any;
    performanceScoreCallback?: (performanceScore: PerformanceScore) => void;
    itemType?: string;
}
