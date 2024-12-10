const filterSelect = document.getElementById('filter');
let chart;

async function fetchSEOData() {
    try {
        const response = await axios.get("http://localhost:3000/api/keywords");
        let keywords = response.data;

        keywords = keywords.sort((a, b) => b.volume - a.volume);

        const selectedFilter = filterSelect.value;
        if (selectedFilter !== 'volume') {
            keywords = keywords.sort((a, b) => b[selectedFilter] - a[selectedFilter]);
        }

        document.getElementById("totalKeywords").innerText = keywords.length;
        document.getElementById("totalVolume").innerText = keywords.reduce(
            (sum, k) => sum + k.volume,
            0
        ).toLocaleString();
        document.getElementById("averageDifficulty").innerText = (
            keywords.reduce((sum, k) => sum + k.difficulty, 0) / keywords.length
        ).toFixed(2);
        document.getElementById("averageTrend").innerText = (
            keywords.reduce((sum, k) => sum + k.trend, 0) / keywords.length
        ).toFixed(2);
        const tableBody = document.getElementById("keywordsTable");
        tableBody.innerHTML = "";
        keywords.forEach((k) => {
            const row = `<tr>
            <td class="border-t px-4 py-2">${k.keyword}</td>
            <td class="border-t px-4 py-2">${k.volume.toLocaleString()}</td>
            <td class="border-t px-4 py-2">${k.difficulty}</td>
            <td class="border-t px-4 py-2">${k.cpc.toFixed(2)}</td>
            <td class="border-t px-4 py-2">${k.trend.toFixed(2)}</td>
            </tr>`;
            tableBody.innerHTML += row;
        });

        const ctx = document.getElementById("keywordsChart").getContext("2d");
        
        if (chart) {
            chart.destroy();
        }

        chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: keywords.slice(0, 10).map((k) => k.keyword),
                datasets: [
                    {
                        label: selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1),
                        data: keywords.slice(0, 10).map((k) => k[selectedFilter]),
                        backgroundColor: "rgba(75, 192, 192, 0.5)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                },
                scales: {
                    y: { 
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)
                        }
                    },
                    x: {
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45
                        }
                    }
                },
            },
        });

        chart.canvas.parentNode.style.height = '400px';
    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
}

document.addEventListener('DOMContentLoaded', fetchSEOData);
filterSelect.addEventListener('change', fetchSEOData);

