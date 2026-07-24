import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './ConfusionGraph.css';

const ConfusionGraph = ({ confusionData }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!confusionData || confusionData.length === 0) return;

    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Count levels for the bar chart
    const levelCounts = [0, 0, 0, 0, 0]; // Levels 1-5
    confusionData.forEach(item => {
      levelCounts[item.level - 1]++;
    });

    // Calculate average confusion level
    const totalResponses = confusionData.length;
    const totalConfusionValue = confusionData.reduce((sum, item) => sum + item.level, 0);
    const averageConfusion = totalConfusionValue / totalResponses;

    // Create chart
    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Clear', 'Mostly Clear', 'Somewhat Confused', 'Confused', 'Very Confused'],
        datasets: [{
          label: 'Number of Students',
          data: levelCounts,
          backgroundColor: [
            '#4caf50', // Clear
            '#8bc34a', // Mostly Clear
            '#ffc107', // Somewhat Confused
            '#ff9800', // Confused
            '#f44336'  // Very Confused
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `Class Confusion Level (Average: ${averageConfusion.toFixed(2)})`,
            font: {
              size: 16
            }
          },
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const percentage = (context.raw / totalResponses * 100).toFixed(1);
                return `${context.raw} students (${percentage}%)`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Students'
            },
            ticks: {
              precision: 0
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [confusionData]);

  return (
    <div className="confusion-graph">
      <div className="chart-container">
        <canvas ref={chartRef}></canvas>
      </div>
      {(!confusionData || confusionData.length === 0) && (
        <div className="no-data">
          No confusion data available yet.
        </div>
      )}
    </div>
  );
};

export default ConfusionGraph;