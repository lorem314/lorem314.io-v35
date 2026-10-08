"use client"

import {
  AnnotationHandler,
  CustomPreProps,
  InnerLine,
  InnerPre,
  getPreRef,
} from "codehike/code"
import React from "react"

const DURATION_MS = 500
const SLIDE_PX = 250 // 对齐 Code Surfer distx
const EASING = "cubic-bezier(0.25, 0.1, 0.25, 1)"

type LineSnap = { text: string; top: number; height: number }

function lineEls(pre: HTMLElement) {
  return Array.from(pre.querySelectorAll<HTMLElement>("[data-ch-line]"))
}

function snapshotLines(pre: HTMLElement): LineSnap[] {
  return lineEls(pre).map((el) => ({
    text: el.dataset.lineText ?? "",
    top: el.offsetTop,
    height: el.offsetHeight,
  }))
}

/** 用多重集合匹配：内容相同的行视为「保留」，其余为「新行」 */
function findEnterIndices(prev: LineSnap[], next: LineSnap[]): number[] {
  const bag = new Map<string, number>()
  for (const p of prev) {
    bag.set(p.text, (bag.get(p.text) ?? 0) + 1)
  }
  const enters: number[] = []
  next.forEach((n, i) => {
    const c = bag.get(n.text) ?? 0
    if (c > 0) bag.set(n.text, c - 1)
    else enters.push(i)
  })
  return enters
}

function cancelAnims(root: HTMLElement) {
  root.getAnimations({ subtree: true }).forEach((a) => a.cancel())
}

function clearMotion(el: HTMLElement) {
  el.style.removeProperty("opacity")
  el.style.removeProperty("transform")
  el.style.removeProperty("height")
  el.style.removeProperty("margin-top")
  el.style.removeProperty("margin-bottom")
  el.style.removeProperty("overflow")
}

/**
 * Pre：step 切换时对比行内容，只让「新行」整行从右侧滑入
 *（可选：行高 0 → auto，更接近 Surfer）
 */
class LineSlidePre extends React.Component<CustomPreProps> {
  ref: React.RefObject<HTMLPreElement>
  alive = true
  isFirst = true

  constructor(props: CustomPreProps) {
    super(props)
    this.ref = getPreRef(this.props)
  }

  componentWillUnmount() {
    this.alive = false
    if (this.ref.current) cancelAnims(this.ref.current)
  }

  render() {
    return (
      <InnerPre
        merge={this.props}
        style={{ position: "relative", overflowX: "hidden" }}
      />
    )
  }

  getSnapshotBeforeUpdate(): LineSnap[] {
    return snapshotLines(this.ref.current!)
  }

  componentDidUpdate(_p: never, _s: never, prevLines: LineSnap[]) {
    const pre = this.ref.current
    if (!pre || !this.alive) return

    cancelAnims(pre)
    lineEls(pre).forEach(clearMotion)

    const nextLines = snapshotLines(pre)
    const els = lineEls(pre)

    // 首次挂载：整块从右侧进入一次即可
    if (this.isFirst) {
      this.isFirst = false
      els.forEach((el, i) => this.animateEnter(el, i * 20))
      return
    }

    const enterIdx = findEnterIndices(prevLines, nextLines)

    enterIdx.forEach((i, stagger) => {
      const el = els[i]
      if (el) this.animateEnter(el, stagger * 30)
    })
  }

  animateEnter(el: HTMLElement, delayMs: number) {
    const h = el.offsetHeight

    // 可选：先「长高」再滑入，更像 Surfer enterLine
    el.style.overflow = "hidden"
    el.style.height = "0px"
    el.style.opacity = "0"
    el.style.transform = `translateX(${SLIDE_PX}px)`

    const anim = el.animate(
      [
        {
          height: "0px",
          opacity: 0,
          transform: `translateX(${SLIDE_PX}px)`,
        },
        {
          height: `${h}px`,
          opacity: 1,
          transform: "translateX(0px)",
          offset: 1,
        },
      ],
      {
        duration: DURATION_MS,
        delay: delayMs,
        easing: EASING,
        fill: "both",
      },
    )

    anim.finished
      .then(() => {
        if (!this.alive) return
        clearMotion(el)
        try {
          anim.cancel()
        } catch {
          /* done */
        }
      })
      .catch(() => {})
  }
}

export const lineSlideIn: AnnotationHandler = {
  name: "line-slide-in",
  PreWithRef: LineSlidePre,
  Line: (props) => {
    // 用纯文本做匹配 key（与 token 样式无关）
    const text =
      typeof props.children === "string"
        ? props.children
        : extractText(props.children)

    return (
      <div
        data-ch-line
        data-line-text={text}
        data-line-number={props.lineNumber}
        style={{
          display: "block",
          // 整行作为 transform 容器
          willChange: "transform, opacity, height",
        }}
      >
        <InnerLine merge={props} style={{ display: "block" }} />
      </div>
    )
  },
}

/** 从 React children 粗提取可见文本，用于行匹配 */
function extractText(node: React.ReactNode): string {
  if (node == null || typeof node === "boolean") return ""
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(extractText).join("")
  if (React.isValidElement(node)) {
    return extractText((node.props as { children?: React.ReactNode }).children)
  }
  return ""
}
