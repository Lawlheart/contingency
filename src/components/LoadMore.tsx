import type { Pokedex } from "../types"

interface LoadMoreProps {
  dexLimit: number
  pokedex: Pokedex
  loadPage: (direction: string) => Promise<void>
}

function LoadMore({pokedex, dexLimit, loadPage}: LoadMoreProps) {
  return (
    <div>
      {Object.keys(pokedex).length < dexLimit && <button onClick={() => loadPage('more')} className="more p-2">
        Load More&nbsp;
        {Math.round(Object.keys(pokedex).length / dexLimit * 100)}%
        </button>}
    </div>
  )
}

export default LoadMore
