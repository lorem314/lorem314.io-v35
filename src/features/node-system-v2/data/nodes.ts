import { NodeDefinition, NodeDefinitionPort } from "../types/node"
// import { CheckUniqueLabels } from "../types/node"

import { NumberInput } from "../components/number-input"

function defineNode<
  const I extends NodeDefinitionPort[],
  const O extends NodeDefinitionPort[],
>(node: NodeDefinition<I, O>) {
  return node
}

// pre defined nodes below

const NumberNode: NodeDefinition = defineNode({
  key: "Node/Number",
  title: "Number",
  inputs: [],
  outputs: [
    {
      label: "value",
      defaultValue: 0,
      renderer: {
        Element: NumberInput,
      },
    },
  ],
})

const SumNode: NodeDefinition = defineNode({
  key: "Node/Sum",
  title: "Sum",
  inputs: [
    {
      label: "summand",
      defaultValue: 0,
      renderer: {
        Element: NumberInput,
      },
    },
    {
      label: "addend",
      defaultValue: 0,
      renderer: {
        Element: NumberInput,
      },
    },
  ],
  outputs: [{ label: "sum", defaultValue: 0 }],
  compute: (inputsValueByLabel) => {
    return { sum: inputsValueByLabel.summand + inputsValueByLabel.addend }
  },
})

const SubtractNode: NodeDefinition = defineNode({
  key: "Node/Subtract",
  title: "Subtract",
  inputs: [
    {
      label: "minuend",
      defaultValue: 0,
      renderer: { Element: NumberInput },
    },
    {
      label: "subtrahend",
      defaultValue: 0,
      renderer: { Element: NumberInput },
    },
  ],
  outputs: [{ label: "difference", defaultValue: 0 }],
  compute: (inputsValueByLabel) => {
    return {
      difference: inputsValueByLabel.minuend - inputsValueByLabel.subtrahend,
    }
  },
})

const MultiplyNode: NodeDefinition = defineNode({
  key: "Node/Multiply",
  title: "Multiply",
  inputs: [
    {
      label: "multiplicand",
      defaultValue: 0,
      renderer: { Element: NumberInput },
    },
    {
      label: "multiplier",
      defaultValue: 0,
      renderer: { Element: NumberInput },
    },
  ],
  outputs: [{ label: "product", defaultValue: 0 }],
  compute: (inputsValueByLabel) => {
    return {
      product: inputsValueByLabel.multiplicand * inputsValueByLabel.multiplier,
    }
  },
})

const DivideNode: NodeDefinition = defineNode({
  key: "Node/Divide",
  title: "Divide",
  inputs: [
    {
      label: "dividend",
      defaultValue: 0,
      renderer: { Element: NumberInput },
    },
    {
      label: "divisor",
      defaultValue: 1,
      renderer: { Element: NumberInput },
    },
  ],
  outputs: [{ label: "quotient", defaultValue: 0 }],
  compute: (inputsValueByLabel) => {
    return {
      quotient: inputsValueByLabel.dividend / inputsValueByLabel.divisor,
    }
  },
})

export const definedNodes = [
  NumberNode,
  SumNode,
  SubtractNode,
  MultiplyNode,
  DivideNode,
]

export const definedNodesByKey = definedNodes.reduce(
  (acc, node) => {
    return {
      ...acc,
      [node.key]: node,
    }
  },
  {} as Record<string, NodeDefinition>,
)
