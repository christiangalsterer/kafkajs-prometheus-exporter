import { describe, expect, test } from '@jest/globals'
import { mergeLabelNamesWithStandardLabels, mergeLabelsWithStandardLabels } from '../src/utils'

describe('tests mergeLabelNamesWithStandardLabels', () => {
  const defaultLabels = { foo: 'bar', alice: 3 }
  const labels = ['label1', 'label2']

  test('test mergeLabelNamesWithStandardLabels with no default labels', () => {
    expect(mergeLabelNamesWithStandardLabels(labels)).toBe(labels)
  })

  test('test mergeLabelNamesWithStandardLabels with default labels', () => {
    expect(mergeLabelNamesWithStandardLabels(labels, defaultLabels)).toStrictEqual(['label1', 'label2', 'foo', 'alice'])
  })
})

describe('tests mergeLabelsWithStandardLabels', () => {
  const defaultLabels = { foo: 'bar', alice: 3 }
  const labels = { label1: 'value1', labels2: 2 }

  test('test mergeLabelsWithStandardLabels with no default labels', () => {
    expect(mergeLabelsWithStandardLabels(labels)).toBe(labels)
  })

  test('test mergeLabelsWithStandardLabels with default labels', () => {
    expect(mergeLabelsWithStandardLabels(labels, defaultLabels)).toStrictEqual({ label1: 'value1', labels2: 2, foo: 'bar', alice: 3 })
  })
})
