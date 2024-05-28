import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import api from '../../../../Config'
import Loader from '../../Userside/HelperComponents/Loader';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = () => {
    const access = localStorage.getItem('access')
    const [dataset, setDataset] = useState(null)
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('admin/postperday/', {
                    headers: {
                        Authorization: `Bearer ${access}`
                    }
                })
                setLoading(false)
                setDataset(response.data)
            } catch (error) {
                console.log(error)
            }
        }

        fetchData()
    },
    [setDataset])

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const chartData = {
        labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Suturday'],
        datasets: [
            {
                label: 'Posts',
                data:dataset? days.map(day =>(
                    dataset[day])):[0,0,0,0,0,0,0]
                ,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },

        ],
    };
    console.log(dataset)
    // Chart.js options
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: false,
            },
            title: {
                display: true,
                text: 'Weekly Post Report',
            },

        },
    };
    if (isLoading) {
        return <Loader />
        
    }
    return <Bar data={chartData} options={options} />;
};

export default BarChart;
