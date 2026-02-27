import { visit } from 'unist-util-visit'
import { Element, Root, Parent } from 'hast'

export function rehypeTableWrapper() {
  return function transformer(tree: Root) {
    visit(tree, 'element', (node: Element, index, parent) => {
      if (node.tagName === 'table' && parent && typeof index === 'number') {
        const headers: string[] = []

        const thead = node.children.find(
          (child): child is Element =>
            child.type === 'element' && child.tagName === 'thead'
        )
        if (thead) {
          const tr = thead.children.find(
            (child): child is Element =>
              child.type === 'element' && child.tagName === 'tr'
          )
          if (tr) {
            const thElements = tr.children.filter(
              (child): child is Element =>
                child.type === 'element' && child.tagName === 'th'
            )
            for (const th of thElements) {
              const text = extractText(th)
              headers.push(text)
            }
          }
        }

        const tbody = node.children.find(
          (child): child is Element =>
            child.type === 'element' && child.tagName === 'tbody'
        )
        if (tbody) {
          for (const row of tbody.children) {
            if (row.type === 'element' && row.tagName === 'tr') {
              row.children.forEach((cell, cellIndex) => {
                if (
                  cell.type === 'element' &&
                  cell.tagName === 'td' &&
                  headers[cellIndex]
                ) {
                  cell.properties = cell.properties || {}
                  cell.properties['data-label'] = headers[cellIndex]
                }
              })
            }
          }
        }

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

function extractText(node: Element): string {
  let text = ''
  for (const child of node.children) {
    if (child.type === 'text') {
      text += child.value
    } else if (child.type === 'element') {
      text += extractText(child)
    }
  }
  return text.trim()
}
