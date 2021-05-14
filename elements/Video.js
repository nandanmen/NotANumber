import { styled, theme } from 'twin.macro'

export default styled.video`
  box-shadow: 8px 8px 0 var(--gray300);

  @media screen and (min-width: ${theme`screens.md`}) {
    border-radius: 8px;
  }
`
