interface PokemonPaginationProps {
  page: number;
  lastPage: number;
  loadPage: (direction: string) => Promise<void>
}

function PokemonPagination({page, lastPage, loadPage}: PokemonPaginationProps) {
  return (
    <div>
      {page !== 1 && <button onClick={() => loadPage('first')} className="first p-2 hover:scale-110">First</button>}
      {page > 1 && <button onClick={() => loadPage('previous')} className="prev p-2 hover:scale-110">&larr; Prev</button>}
      {page < lastPage && <button onClick={() => loadPage('next')} className="next p-2 hover:scale-110">Next &rarr;</button>}
      {page < lastPage && <button onClick={() => loadPage('last')} className="last p-2 hover:scale-110">Last</button>}
    </div>
)
}

export default PokemonPagination
