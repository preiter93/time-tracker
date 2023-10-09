/**
 * Blurs the node when Enter is pressed
   * @param {HTMLElement} node
 */
export function blurOnEnter(node) {

  const handleKey = (/** @type {any} */ event) => {
    if (event.key === 'Enter' && node && typeof node.blur === 'function') node.blur()
  }

  node.addEventListener('keydown', handleKey)

  return {
    destroy() {
      node.removeEventListener('keydown', handleKey)
    }
  }
}
