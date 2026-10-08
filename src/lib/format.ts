const rtf = new Intl.RelativeTimeFormat("zh", { numeric: "always" })

const units = [
  { name: "year" as const, seconds: 1 * 60 * 60 * 24 * 7 * 4 * 12 },
  { name: "month" as const, seconds: 1 * 60 * 60 * 24 * 7 * 4 },
  { name: "week" as const, seconds: 1 * 60 * 60 * 24 * 7 },
  { name: "day" as const, seconds: 1 * 60 * 60 * 24 },
  { name: "hour" as const, seconds: 1 * 60 * 60 },
  { name: "minute" as const, seconds: 1 * 60 },
  { name: "second" as const, seconds: 1 },
]

export const getRelativeTimeString = (
  d1: Date,
  d2: Date = new Date(),
  options?: { space?: boolean },
) => {
  const { space = false } = options || {}

  const diffInMs = d1.getTime() - d2.getTime()
  const diffInSeconds = Math.round(diffInMs / 1000)

  let chosenUnit: (typeof units)[number] = units[0]
  for (const unit of units) {
    if (Math.abs(diffInSeconds) >= unit.seconds || unit.name === "second") {
      chosenUnit = unit
      break
    }
  }

  const value = Math.round(diffInSeconds / chosenUnit.seconds)

  if (!space) {
    return rtf.format(value, chosenUnit.name)
  }

  const parts = rtf.formatToParts(value, chosenUnit.name)

  return parts
    .map((part, index) =>
      part.type === "integer" && index < parts.length - 1
        ? part.value + " "
        : part.value,
    )
    .join("")
}

const dtf = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "long",
  day: "numeric",
})

export const getDateTimeString = (
  date: Date,
  options?: { space?: boolean },
) => {
  const { space = false } = options || {}

  if (!space) {
    return dtf.format(date)
  }

  const parts = dtf.formatToParts(date)

  return parts
    .map((part) => {
      const { type } = part

      if (type === "year" || type === "month" || type === "day") {
        return " " + part.value + " "
      }

      return part.value
    })
    .join("")
    .trim()
}
