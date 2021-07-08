const container = document.querySelector('#container');
const gridSize = 64;
const gridPercent = 100 / gridSize;

for (let i = 0; i < gridSize * gridSize; i++) {
  const block = createBlock();
  container.appendChild(block);
}

function createBlock() {
  const block = document.createElement('div');
  block.classList.add('block');

  block.style.cssText = `width: ${gridPercent}%;padding-bottom: ${gridPercent}%`;

  block.addEventListener('mouseenter', () => {
    block.classList.add('hovered')
  });

  return block;
}

function clearDrawing() {
  const blocks = document.querySelectorAll('.block');

  blocks.forEach(block => {
    block.classList.remove('hovered')
  })
}