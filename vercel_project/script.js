
async function fetchData(file) {
  const res = await fetch('data/' + file);
  return res.json();
}

async function renderCharts() {
  const clusterPoints = await fetchData('cluster_points.json');
  const clusterDiag = await fetchData('cluster_diagnostico.json');
  const campanhas = await fetchData('preferencias_campanhas.json');
  const regCoeffs = await fetchData('regression_coeffs.json');
  const clvSegments = await fetchData('clv_segments.json');

  // Cluster scatter
  new Chart(document.getElementById('clusterChart'), {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Clusters',
        data: clusterPoints.map(p => ({x: p.pca1, y: p.pca2, cluster: p.cluster})),
        backgroundColor: clusterPoints.map(p => ['#FF6384','#36A2EB','#FFCE56'][p.cluster])
      }]
    },
    options: {
      scales: { x: { title: { display: true, text: 'PCA 1' } }, y: { title: { display: true, text: 'PCA 2' } } }
    }
  });

  // Cluster diagnostics bar
  new Chart(document.getElementById('clusterDiagChart'), {
    type: 'bar',
    data: {
      labels: clusterDiag.map(c => 'Cluster ' + c.cluster),
      datasets: [
        { label: 'Frequência Compras', data: clusterDiag.map(c => c.frequencia_compras) },
        { label: 'Total Gasto', data: clusterDiag.map(c => c.total_gasto) },
        { label: 'Última Compra (dias)', data: clusterDiag.map(c => c.ultima_compra) }
      ]
    },
    options: { responsive: true, scales: { y: { beginAtZero: true } } }
  });

  // Campanha ROI bar
  new Chart(document.getElementById('campanhaChart'), {
    type: 'bar',
    data: {
      labels: campanhas.map(c => c.campanha),
      datasets: [
        { label: 'Gasto Médio/Cliente', data: campanhas.map(c => c.gasto_medio_por_cliente) },
        { label: 'ROI Estimado', data: campanhas.map(c => c.roi_estimado) }
      ]
    },
    options: { responsive: true, scales: { y: { beginAtZero: true } } }
  });

  // Regression coefficients
  new Chart(document.getElementById('regressionChart'), {
    type: 'bar',
    data: {
      labels: regCoeffs.map(r => r.variable),
      datasets: [{ label: 'Coeficiente', data: regCoeffs.map(r => r.coefficient) }]
    },
    options: { responsive: true, scales: { y: { beginAtZero: true } } }
  });

  // CLV segments
  new Chart(document.getElementById('clvChart'), {
    type: 'pie',
    data: {
      labels: clvSegments.map(c => c.segmento_valor || c.index),
      datasets: [{ data: clvSegments.map(c => c.count) }]
    }
  });
}

document.addEventListener('DOMContentLoaded', renderCharts);
