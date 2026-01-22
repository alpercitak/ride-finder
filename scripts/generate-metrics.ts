import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';

async function getDirSize(dir: string): Promise<number> {
  const files = await readdir(dir, { recursive: true });
  const stats = await Promise.all(files.map((file) => stat(path.join(dir, file)).catch(() => ({ size: 0 }))));
  return stats.reduce((acc, { size }) => acc + size, 0);
}

// 1. Calculate Bundle Size (in KB)
const distSizeInBytes = await getDirSize('./dist');
const distSizeInKB = (distSizeInBytes / 1024).toFixed(2);

// 2. Count Total Dependencies (from package.json)
const pkg = await Bun.file('./package.json').json();
const totalDeps = Object.keys(pkg.dependencies || {}).length + Object.keys(pkg.devDependencies || {}).length;

// 3. (Optional) Custom Performance Metric
// You could run a specific function and measure it here
const start = performance.now();
// logic you want to profile...
const end = performance.now();

const metrics = [
  {
    name: 'Bundle Size',
    unit: 'KB',
    value: parseFloat(distSizeInKB),
  },
  {
    name: 'Total Dependencies',
    unit: 'count',
    value: totalDeps,
  },
  {
    name: 'Execution Latency',
    unit: 'ms',
    value: parseFloat((end - start).toFixed(2)),
  },
];

await Bun.write('output.json', JSON.stringify(metrics, null, 2));
console.log('✅ Metrics generated in output.json');
