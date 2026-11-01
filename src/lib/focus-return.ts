/**
 * Lightweight focus stack so closing a dialog can restore the previously focused control.
 */
const stack: HTMLElement[] = [];

export function rememberFocus(current: Element | null = null) {
  const active =
    (current as HTMLElement | null) ||
    (typeof document !== 'undefined' ? (document.activeElement as HTMLElement | null) : null);
  if (!active || active === document.body) return;
  if (stack[stack.length - 1] === active) return;
  stack.push(active);
}

export function restoreFocus() {
  const previous = stack.pop();
  if (!previous) return;
  window.setTimeout(() => {
    try {
      if (previous.isConnected) previous.focus();
    } catch {
      // Ignore focus errors on detached nodes
    }
  }, 0);
}
