import React, {FC} from "react";
import {PerformanceScore} from '../../model/performance-score';

interface PerformanceTableProps {
    performanceScores: PerformanceScore[];
}

const PerformanceTable: FC<PerformanceTableProps> = (({performanceScores}) => {
    return (
        <div className={'performance-table'}>
            <h2>Peformance score</h2>
            <div className="table-wrapper">
                <table className="fl-table">
                    <thead>
                    <tr>
                        <th>Time in ms</th>
                        <th>Description</th>
                    </tr>
                    </thead>
                    <tbody>
                    {performanceScores
                        .map((score, index) =>
                            <tr key={index}>
                                <td>{score.time}</td>
                                <td>{score.description}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
});

export default PerformanceTable;
