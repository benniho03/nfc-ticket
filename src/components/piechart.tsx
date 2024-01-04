import React from "react";
import { Pie } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";


ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart({
    label1, label2, value1, value2
}: {label1: string, label2: string, value1: number, value2: number}){
    const data = {
        labels: [
            label1,
            label2
        ],
        datasets: [{
            data: [value1, value2],
            backgroundColor: [
                'rgb(172, 0, 0)',
                'rgb(228, 142, 142)'
            ]
        }]
    };

    return <Pie data={data} />;
}

export default PieChart;