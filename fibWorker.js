const { parentPort } = require('worker_threads');

function fib(n) {
  if (n <= 1) return 1;
  return fib(n - 1) + fib(n - 2);
}

parentPort.on('message', (msg) => {
  if (msg.type === 'FIB_TASK') {
    const result = fib(msg.payload);
    parentPort.postMessage({ type: 'FIB_RESULT', data: result });
  }
});
