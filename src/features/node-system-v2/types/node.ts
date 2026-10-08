import React, { ComponentPropsWithoutRef } from "react"

// export type CheckUniqueLabels<
//   T extends readonly NodeDefinitionPort[],
//   Seen extends string = never,
// > = T extends readonly [
//   infer Head extends NodeDefinitionPort,
//   ...infer Tail extends NodeDefinitionPort[],
// ]
//   ? Head["label"] extends Seen
//     ? `❌ 错误：检测到重复的 label [${Head["label"]}]` // 发现重复直接报文本错误
//     : readonly [Head, ...CheckUniqueLabels<Tail, Seen | Head["label"]>]
//   : T // 如果是空的或者校验结束，原样返回

//

// 节点 的 抽象定义
export type NodeDefinitionPort<T extends React.ElementType = any> = {
  // inputs outputs 中的多个 label 的值 不应重复
  label: string
  defaultValue: any
  renderer?: {
    Element: T
    props?: ComponentPropsWithoutRef<T> & Record<string, any>
  }
}

export type PortByLabel<T extends NodeDefinitionPort[]> = {
  [P in T[number]["label"]]: any
}

export type NodeDefinition<
  I extends NodeDefinitionPort[] = NodeDefinitionPort[],
  O extends NodeDefinitionPort[] = NodeDefinitionPort[],
> = {
  key: string
  title: string
  inputs: I
  outputs: O
  compute?: (inputsValueByLabel: PortByLabel<I>) => PortByLabel<O>
}

// 节点 在运行时的类型
export type NodeInstance = {
  // 用于在多个 node 中区分自身 同类型的节点 key 值总是相同
  key: string

  title: string

  //

  // 运行时 id 同样 key 的节点 有不同的 id
  id: string

  coord: { x: number; y: number }

  inputsValueByLabel: Record<string, any>
  outputsValueByLabel: Record<string, any>

  portsCoordOffsetByLabel: Record<string, { x: number; y: number }>

  inputsConnectionByLabel: Record<string, string | null>
  outputsConnectionsByLabel: Record<string, string[]>
}
