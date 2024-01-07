import Position from '../../entities/2d/position';

const offset = new Position(0, 0);
const position = new Position(0, 0);
let initialStylePosition = 'static';

const elementDrag = (e: MouseEvent, target: HTMLElement) => {
  e.preventDefault();

  // calculate the new cursor position:
  position.x = e.clientX;
  position.y = e.clientY;

  // set the element's new position:
  target.style.top = (position.y + offset.y) + "px";
  target.style.left = (position.x + offset.x) + "px";
  target.style.position = "absolute";
};

const closeDragElement = (target: HTMLElement) => {
  // stop moving when mouse button is released:
  document.onmouseup = null;
  document.onmousemove = null;

  target.style.position = initialStylePosition;
};

const onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  if (!e || !e.target) return;
  e.preventDefault();

  // get the mouse cursor position at startup:
  const target = e.target as HTMLElement;
  const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = target;
  const { top, left } = target.getBoundingClientRect();

  const clientXItemPoint = Math.round(e.clientX - left);
  const clientYItemPoint = Math.round(e.clientY - top);

  const snapToMouseXCenter = clientXItemPoint - (offsetWidth / 2);
  const snapToMouseYCenter = clientYItemPoint - (offsetHeight / 2);

  offset.x = offsetLeft - e.clientX + snapToMouseXCenter;
  offset.y = offsetTop - e.clientY + snapToMouseYCenter;

  initialStylePosition = target.style.position;

  document.onmouseup = () => closeDragElement(target);
  document.onmousemove = (ev) => elementDrag(ev, target);
};

export {
  onMouseDown
};
