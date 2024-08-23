let chartInstance = null; // Variable para almacenar la instancia del gráfico

function plotHyperbola() {
    // Obtener los valores de a y b del formulario
    const a = parseFloat(document.getElementById('a').value);
    const b = parseFloat(document.getElementById('b').value);
    const c = Math.sqrt(a**2 + b**2);

    // Calcular vértices, focos y asíntotas
    const vertices = [{ x: a, y: 0 }, { x: -a, y: 0 }];
    const focos = [{ x: c, y: 0 }, { x: -c, y: 0 }];
    const asíntotas = [
        { x: -10, y: (b / a) * -10 },
        { x: 10, y: (b / a) * 10 },
        { x: -10, y: -(b / a) * -10 },
        { x: 10, y: -(b / a) * 10 }
    ];

    const x = [];
    const y1 = [];
    const y2 = [];
    const numPoints = 1000;
    const xRange = Math.max(2 * a, 2 * c); // Ajusta el rango en x según a y c

    // Calcular los puntos para la hipérbola
    for (let i = -xRange; i <= xRange; i += (2 * xRange / numPoints)) {
        if (i**2 >= a**2) {
            x.push(i);
            y1.push((b / a) * Math.sqrt(i**2 - a**2));
            y2.push(-(b / a) * Math.sqrt(i**2 - a**2));
        }
    }

    // Eliminar el gráfico anterior si existe
    if (chartInstance) {
        chartInstance.destroy();
    }

    // Configuración de la gráfica
    const ctx = document.getElementById('hyperbolaChart').getContext('2d');
    chartInstance = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Hipérbola Superior',
                data: x.map((xi, index) => ({ x: xi, y: y1[index] })),
                borderColor: 'blue',
                borderWidth: 1,
                showLine: true,
                fill: false
            }, {
                label: 'Hipérbola Inferior',
                data: x.map((xi, index) => ({ x: xi, y: y2[index] })),
                borderColor: 'blue',
                borderWidth: 1,
                showLine: true,
                fill: false
            }, {
                label: 'Vértices',
                data: vertices,
                backgroundColor: 'red',
                pointRadius: 5,
                pointStyle: 'rect'
            }, {
                label: 'Focos',
                data: focos,
                backgroundColor: 'green',
                pointRadius: 5
            }, {
                label: 'Asíntotas',
                data: asíntotas,
                borderColor: 'red',
                borderWidth: 1,
                borderDash: [5, 5],
                showLine: true
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    ticks: {
                        stepSize: 1
                    },
                    title: {
                        display: true,
                        text: 'Eje x'
                    }
                },
                y: {
                    ticks: {
                        stepSize: 1
                    },
                    title: {
                        display: true,
                        text: 'Eje y'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true
                },
                tooltip: {
                    callbacks: {
                        title: function() { return ''; },
                        label: function(tooltipItem) {
                            const dataset = tooltipItem.dataset;
                            const index = tooltipItem.dataIndex;
                            return dataset.label + ': (' + tooltipItem.raw.x.toFixed(2) + ', ' + tooltipItem.raw.y.toFixed(2) + ')';
                        }
                    }
                }
            },
            layout: {
                padding: {
                    left: 20,
                    right: 20,
                    top: 20,
                    bottom: 20
                }
            }
        }
    });

    // Mostrar los cálculos
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <h3>Resultados</h3>
        <p>Vértices: ${vertices.map(v => `(${v.x.toFixed(2)}, ${v.y.toFixed(2)})`).join(', ')}</p>
        <p>Focos: ${focos.map(f => `(${f.x.toFixed(2)}, ${f.y.toFixed(2)})`).join(', ')}</p>
    `;
}

// Función para descargar la gráfica
document.getElementById('downloadBtn').addEventListener('click', () => {
    if (chartInstance) {
        const link = document.createElement('a');
        link.href = chartInstance.toBase64Image();
        link.download = 'hiperbola.png';
        link.click();
    } else {
        alert('No hay ninguna gráfica para descargar.');
    }
});
