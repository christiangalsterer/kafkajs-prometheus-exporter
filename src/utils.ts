/**
 * Merges an array of label names with the label names of the default labels into a new array.
 * @param labelNames array of label names to merge with the default labels
 * @param defaultLabels default labels to merge with
 * @returns array of merged label names
 */
export function mergeLabelNamesWithStandardLabels(labelNames: string[], defaultLabels = {}): string[] {
  return labelNames.concat(Object.keys(defaultLabels))
}

/**
 * Merges Labels with default labels
 * @param labels labels to merge with the default labels
 * @param defaultLabels default labels to merge with
 * @returns merged labels
 */
export function mergeLabelsWithStandardLabels(
  labels: Record<string, string | number | undefined>,
  defaultLabels = {}
): Record<string, string | number> {
  const filtered = Object.fromEntries(
    Object.entries(labels)
      .filter(([key, value]) => value !== undefined)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .map(([key, value]) => [key, value!])
  ) as Record<string, string | number>
  return { ...filtered, ...defaultLabels }
}
