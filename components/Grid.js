import { styled, theme } from 'twin.macro'

const Grid = styled.div`
  display: grid;
  grid-template-columns: 2rem 1fr 2rem;

  > * {
    grid-column: 2 / span 1;
  }

  > .full-width {
    grid-column: 1 / -1;
  }

  @media (min-width: ${theme`screens.md`}) {
    grid-template-columns: 1fr 2rem min(65ch, calc(100% - 2rem)) 2rem 1fr;

    > * {
      grid-column: 3 / span 1;
    }

    > .full-width {
      grid-column: 2 / -2;
    }
  }
`

export default Grid
