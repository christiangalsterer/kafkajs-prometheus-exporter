/**
 * Merges an array of label names with the label names of the default labels into a new array.
 * @param labelNames array of label names to merge with the default labels
 * @param defaultLabels  default labels to merge with
 * @returns array of merged label names
 */
export function mergeLabelNamesWithStandardLabels (labelNames: string[], defaultLabels?: Record<string, string | number>): string[] {
  let merged: string[]
  defaultLabels !== undefined ? merged = labelNames.concat(Object.keys(defaultLabels)) : merged = labelNames
  return merged
}

export function mergeLabelsWithStandardLabels (labels: Record<string, string | number>, defaultLabels?: Record<string, string | number>): Record<string, string | number> {
  let merged: Record<string, string | number>
  defaultLabels !== undefined ? merged = { ...labels, ...defaultLabels } : merged = labels
  return merged
}
