function parsePrometheusMetric(metric) {
  const regex = /(.*?)\{(.*?)\}\s(.*?)$/;
  const match = metric.match(regex);
  if (match) {
    const metricName = match[1];
    const label = match[2];
    const value = match[3];
    return { metricName, label, value };
  }
  return null;

}
const metric = 'go_gc_duration_seconds{quantile="0"} 3.7254e-05';
const parsedMetric = parsePrometheusMetric(metric);
console.log(parsedMetric);
