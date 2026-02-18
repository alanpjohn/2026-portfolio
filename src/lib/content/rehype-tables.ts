import { visit } from 'unist-util-visit'
import { Element, Root, Parent } from 'hast'

export function rehypeTableWrapper() {
  return function transformer(tree: Root) {
    visit(tree, 'element', (node: Element, index, parent) => {
      if (node.tagName === 'table' && parent && typeof index === 'number') {
        const wrapper: Element = {
          type: 'element',
          tagName: 'div',
          properties: { class: 'table-wrapper' },
          children: [node]
        }
        ;(parent as Parent).children[index] = wrapper
      }
    })
  }
}
