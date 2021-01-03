import rfdc from 'rfdc'

const clone = rfdc()

const snapshot = {
  createSnapshot() {
    const data = []
    return {
      data,
      push(snapshot) {
        data.push(clone(snapshot))
      },
    }
  },
}

export default snapshot
