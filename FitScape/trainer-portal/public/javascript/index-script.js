/* Move the custom cursor along with the mouse */
document.addEventListener('mousemove', (e) => {
  const cursor = document.querySelector('.custom-cursor');
  cursor.style.left = `${e.pageX}px`;
  cursor.style.top = `${e.pageY}px`;
});

/* Optionally add a small animation effect when clicking */
document.addEventListener('mousedown', () => {
  const cursor = document.querySelector('.custom-cursor');
  cursor.style.transform = 'translate(-50%, -50%) scale(0.8)'; /* Shrink on click */
});
document.addEventListener('mouseup', () => {
  const cursor = document.querySelector('.custom-cursor');
  cursor.style.transform = 'translate(-50%, -50%) scale(1)'; /* Return to normal size */
});
