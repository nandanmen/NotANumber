import snapshot from './snapshot'

export default function exec(algorithm, inputs) {
  const snapshots = snapshot.createSnapshot()
  const returnVal = algorithm(snapshots)(...inputs)

  const last = snapshots.data[snapshots.data.length - 1]
  if (last) {
    last.__done = true
    last.__returnValue = returnVal
  }

  return snapshots.data
}
