import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import TitleCard from '../../../components/Cards/TitleCard';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function BarChart({title}) {

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      }
    },
  };

  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  const data = {
    labels,
    datasets: [
      {
        label: 'Store 1',
        data: labels.map(() => { return Math.random() * 1000 + 500 }),
        backgroundColor: 'rgba(255, 99, 132, 1)',
      },
      {
        label: 'Store 2',
        data: labels.map(() => { return Math.random() * 1000 + 500 }),
        backgroundColor: 'rgba(53, 162, 235, 1)',
      },
    ],
  };

  return (
    <TitleCard title={title}>
      <Bar options={options} data={data} />
    </TitleCard>

  )
}


export default BarChart
