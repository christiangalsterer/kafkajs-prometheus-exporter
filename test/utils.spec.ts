import { describe, expect, test } from '@jest/globals'
import { mergeLabelNamesWithStandardLabels, mergeLabelsWithStandardLabels } from '../src/utils'

describe('tests mergeLabelNamesWithStandardLabels', () => {
  const defaultLabels = { foo: 'bar', alice: 3 }
  const labels = ['label1', 'label2']
  const emptylabels = []

  test('test mergeLabelNamesWithStandardLabels with no default labels', () => {
    expect(mergeLabelNamesWithStandardLabels(labels)).toStrictEqual(labels)
  })

  test('test mergeLabelNamesWithStandardLabels with empty labels and no default labels', () => {
    expect(mergeLabelNamesWithStandardLabels(emptylabels)).toStrictEqual([])
  })

  test('test mergeLabelNamesWithStandardLabels with default labels', () => {
    expect(mergeLabelNamesWithStandardLabels(labels, defaultLabels)).toStrictEqual(['label1', 'label2', 'foo', 'alice'])
  })

  test('test mergeLabelNamesWithStandardLabels with empty labels and default labels', () => {
    expect(mergeLabelNamesWithStandardLabels(emptylabels, defaultLabels)).toStrictEqual(['foo', 'alice'])
  })
})

describe('tests mergeLabelsWithStandardLabels', () => {
  const defaultLabels = { foo: 'bar', alice: 3 }
  const labels = { label1: 'value1', labels2: 2 }
  const emptyLabels = {}

  test('test mergeLabelsWithStandardLabels with labels and no default labels', () => {
    expect(mergeLabelsWithStandardLabels(labels)).toStrictEqual(labels)
  })

  test('test mergeLabelsWithStandardLabels with empty labels and no default labels', () => {
    expect(mergeLabelsWithStandardLabels(emptyLabels)).toStrictEqual(emptyLabels)
  })

  test('test mergeLabelsWithStandardLabels with labels and default labels', () => {
    expect(mergeLabelsWithStandardLabels(labels, defaultLabels)).toStrictEqual({ label1: 'value1', labels2: 2, foo: 'bar', alice: 3 })
  })

  test('test mergeLabelsWithStandardLabels with empty labels and default labels', () => {
    expect(mergeLabelsWithStandardLabels(emptyLabels, defaultLabels)).toStrictEqual(defaultLabels)
  })
})
