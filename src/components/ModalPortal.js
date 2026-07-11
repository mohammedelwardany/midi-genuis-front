import { createPortal } from 'react-dom';

// Renders its children as a direct child of <body>, escaping the page's own
// DOM subtree (and any layout/sticky-header stacking context inside it)
// entirely. Modals rendered inline inside a page component can end up
// nested many levels deep inside the app's layout - a z-index alone doesn't
// guarantee coverage if something up that tree interferes, and a portal
// removes the question altogether.
export default function ModalPortal({ children }) {
  return createPortal(children, document.body);
}
