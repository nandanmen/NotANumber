import tw, { styled, theme } from 'twin.macro'
import { HiArrowRight } from 'react-icons/hi'

import CodeBlock from '../elements/CodeBlock'

const inputCode = `var a = 10`
const outputCode = `let a = 10`

export default function BabelPipeline() {
  return (
    <Wrapper>
      <Section caption="Parse">
        <CodeBlock tw="p-2!">{inputCode}</CodeBlock>
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
        <Tree />
        <Arrow />
        <CodeBlock tw="p-2!">{outputCode}</CodeBlock>
      </Section>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  column-gap: 20px;
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

  list-style: none !important;
`

const Plugin = styled.li`
  ${tw`font-mono text-sm`}

  background: white;
  padding: 8px;
  border-radius: 6px;
`

// --

function Tree() {
  return (
    <TreeWrapper>
      <LeafWrapper>
        <Node />
      </LeafWrapper>
      <LeafWrapper>
        <Node />
        <Node />
      </LeafWrapper>
    </TreeWrapper>
  )
}

const TreeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 16px;
`

const Node = styled.div`
  background: white;
  position: relative;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid ${theme`colors.gray.300`};
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
      background: ${theme`colors.gray.300`};
      top: 120%;
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

const LeafWrapper = styled.div`
  display: flex;
  column-gap: 20px;
`

// --

function Arrow() {
  return (
    <ArrowWrapper>
      <HiArrowRight />
    </ArrowWrapper>
  )
}

const ArrowWrapper = tw.div`flex items-center justify-center w-8 h-8 text-gray-500 bg-gray-200 border-2 border-gray-300 rounded-full dark:(bg-blacks-300 border-blacks-300 text-gray-200)`

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
  display: flex;
  align-items: center;
  column-gap: 16px;
`

const SectionCaption = styled.caption`
  ${tw`font-mono text-sm text-gray-600`}

  display: block;
  text-align: center;
  margin-top: 16px;
`
