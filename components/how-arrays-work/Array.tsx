import useMemory from '@/lib/memory'

export default function Array() {
  const mem = useMemory()
  return (
    <div>
      <button onClick={() => mem.set(2, Math.random() * 10)}>Set</button>
      <p>{mem.get(2)}</p>
    </div>
  )
}
