/**
 * Given a JavaScript code string and an array of inputs, asynchronously
 * executes the code using a web worker. Assumes that the default export of the
 * script is a function that accepts the array of inputs.
 */
export function execute(code: string, inputs: any[]) {
  return new Promise((resolve, reject) => {
    const worker = new Worker('/code-runner.worker.js')

    const timeout = setTimeout(() => {
      worker.terminate()
      reject(new Error(`Timed out while running algorithm`))
    }, 2000)

    worker.addEventListener('message', (evt) => {
      clearTimeout(timeout)

      worker.terminate()
      resolve(evt.data)
    })

    worker.addEventListener('error', (evt) => {
      clearTimeout(timeout)
      reject(new Error(evt.message))
    })

    worker.postMessage({
      inputs,
      code,
    })
  })
}
