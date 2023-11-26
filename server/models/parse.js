import axios from 'axios';

function parsePrometheusMetric(metric) {
  const regex = /(.*?)\{(.*?)\}\s(.*?)$/;
  const regexWithoutLabel = /^(\w+)\s([0-9.]+)$/;
  const match = metric.match(regex);
  const matchWithoutLabel = metric.match(regexWithoutLabel);
  if (match) {
    const metricName = match[1];
    const label = match[2];
    const value = match[3];
    return { metricName, label, value };
  }

  if (matchWithoutLabel) {
    const metricName = matchWithoutLabel[1];
    const label = '';
    const value = matchWithoutLabel[2];
    return { metricName, label, value };
  }
  return null;
}

export function parsePrometheusMetrics(metrics) {
  return metrics
    .split('\n')
    .filter((line) => line && !line.startsWith('#'))
    .map((element) => parsePrometheusMetric(element))
    .filter((matric) => matric !== null);
}

export async function getMetrics(metricUrl) {

  const data = await axios.get(metricUrl)
    .then((response) => response.data);
  const parsedData = parsePrometheusMetrics(data);

  return parsedData.filter((item) => !item.metricName.startsWith('nodejs') && !item.metricName.startsWith('process'));

}
