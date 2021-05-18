import tw, { styled, theme } from 'twin.macro'
import { HiArrowRight } from 'react-icons/hi'

import CodeBlock from '@/elements/CodeBlock'

const inputCode = `var a = 10`
const outputCode = `let a = 10`

export default function BabelPipeline() {
  return (
    <Wrapper>
      <Section caption="Parse">
        <CodeBlock style={{ '--space': '8px' }}>{inputCode}</CodeBlock>
        <Arrow />
        <Tree />
      </Section>
      <Section caption="Traverse">
        <Arrow />
        <PluginWrapper>
          <Plugin>Plugin</Plugin>
          <Plugin>Plugin</Plugin>
          <Plugin>Plugin</Plugin>
        </PluginWrapper>
        <Arrow />
      </Section>
      <Section caption="Generate">
        <Tree isSquare />
        <Arrow />
        <CodeBlock style={{ '--space': '8px' }}>{outputCode}</CodeBlock>
      </Section>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  ${tw`space-x-6`}

  display: flex;
  justify-content: flex-start;
  align-items: center;
  overflow-x: scroll;
  padding: 0 32px;

  > :last-child {
    padding-right: 32px;
  }

  @media screen and (min-width: ${theme`screens.md`}) {
    padding: revert;
    justify-content: center;
    overflow-x: revert;

    > :last-child {
      padding: revert;
    }
  }
`

const PluginWrapper = styled.ul`
  ${tw`space-y-1`}
`

const Plugin = styled.li`
  font-family: var(--text-mono);
  font-size: var(--text-sm);
  border: 2px solid var(--border-color);
  background: var(--code-background);
  padding: 8px;
  border-radius: 6px;
`

// --

function Tree({ isSquare }) {
  return (
    <TreeWrapper>
      <RootWrapper>
        <Node style={{ '--radius': isSquare ? '8px' : '50%' }} />
      </RootWrapper>
      <Node style={{ '--radius': isSquare ? '8px' : '50%' }} />
      <Node style={{ '--radius': isSquare ? '8px' : '50%' }} />
    </TreeWrapper>
  )
}

const TreeWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 20px;
`

const Node = styled.div`
  background: var(--code-background);
  position: relative;
  width: 32px;
  height: 32px;
  border-radius: var(--radius);
  border: 2px solid var(--border-color);
  z-index: 0;

  &:only-child {
    display: flex;
    justify-content: center;

    &:after,
    &:before {
      position: absolute;
      content: '';
      width: 40px;
      height: 4px;
      background: var(--border-color);
      top: 122%;
    }

    &:after {
      transform: rotate(60deg) translateX(12px);
      left: 10%;
    }

    &:before {
      transform: rotate(-60deg) translateX(-12px);
      right: 10%;
    }
  }
`

const RootWrapper = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
`

// --

function Arrow() {
  return (
    <ArrowWrapper>
      <HiArrowRight />
    </ArrowWrapper>
  )
}
const ArrowWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 2px solid var(--border-color);
  background: var(--brown);
  border-radius: 50%;
`

// --

function Section({ children, caption }) {
  return (
    <section>
      <SectionContent>{children}</SectionContent>
      <SectionCaption>{caption}</SectionCaption>
    </section>
  )
}

const SectionContent = styled.div`
  ${tw`space-x-8`}

  display: flex;
  align-items: center;
`

const SectionCaption = styled.caption`
  font-family: var(--text-mono);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  display: block;
  text-align: center;
  margin-top: 16px;
`
