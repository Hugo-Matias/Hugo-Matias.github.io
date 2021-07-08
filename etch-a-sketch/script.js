let gridSize = 16;

const canvasSlider = document.querySelector('#canvas-size');
canvasSlider.oninput = () => {
  switch (canvasSlider.value) {
    case '1':
      gridSize = 4;
      break;
    case '2':
      gridSize = 8;
      break; 
    case '3':
      gridSize = 16;
      break;
    case '4':
      gridSize = 32;
      break;
    case '5':
      gridSize = 64;
      break;
    case '6':
      gridSize = 128;
      break;
  }
  
  clearGrid()
  createGrid();
}

const clearBtn = document.querySelector('.clear');
clearBtn.addEventListener('click', clearDrawing);

function clearGrid(){
  const blocks = document.querySelectorAll('.block')

  blocks.forEach(block => {
    block.remove()
  })
}

function createGrid(){
  const gridArea = gridSize * gridSize;
  const container = document.querySelector('.container');

  for (let i = 0; i < gridArea; i++) {
    const block = createBlock();
    container.appendChild(block);
  };
}

function createBlock() {
  const blockSize = 100 / gridSize;
  const block = document.createElement('div');

  block.classList.add('block');
  block.style.cssText = `width: ${blockSize}%;padding-bottom: ${blockSize}%`;
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

createGrid()