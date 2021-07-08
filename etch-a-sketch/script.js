let gridSize = 16;
let color = '#222';
const colors = ['#1a1c2c',
'#5d275d',
'#b13e53',
'#ef7d57',
'#ffcd75',
'#a7f070',
'#38b764',
'#257179',
'#29366f',
'#3b5dc9',
'#41a6f6',
'#73eff7',
'#f4f4f4',
'#94b0c2',
'#566c86',
'#333c57']

function manageCanvas() {
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
}

function managePencil() {
  const pencilButtons = document.querySelectorAll('input[name="pencil"]');

  pencilButtons.forEach(btn => {
    btn.addEventListener('click', selectColor);
  });
}

function clearGrid(){
  const blocks = document.querySelectorAll('.block');

  blocks.forEach(block => {
    block.remove();
  });
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
  block.style.cssText = `width: ${blockSize}%;padding-bottom: ${blockSize}%;background-color:#fff;`;

  block.addEventListener('mouseenter', (e) => {
    if(e.buttons == 1) {
      selectColor(block);
    };
  });
  block.addEventListener('mousedown', () => {
    selectColor(block);
  })

  return block;
}

function clearDrawing() {
  const blocks = document.querySelectorAll('.block');

  blocks.forEach(block => {
    block.style.backgroundColor = 'white';
  });
}

function selectColor(block) {
  const pencils = document.querySelectorAll('input[name="pencil"]')

  pencils.forEach(p => {
    if (p.checked) {
      switch (p.value) {
        case 'rainbow':
          const index = Math.floor(Math.random() * colors.length)
          color = colors[index];
          break;
      
        case 'burn':
          color = convertColor(block.style.backgroundColor, true)
          break;

        case 'dodge':
          color = convertColor(block.style.backgroundColor, false)
          break;

        default:
          color = '#222';
          break;
      }
    }
  })
  
  block.style.backgroundColor = color;
}

function convertColor (color, burn) {
  function RGBToHSL(rgb, burn) {
    let sep = rgb.indexOf(",") > -1 ? "," : " ";
    rgb = rgb.substr(4).split(")")[0].split(sep);
  
    for (let R in rgb) {
      let r = rgb[R];
      if (r.indexOf("%") > -1) 
        rgb[R] = Math.round(r.substr(0,r.length - 1) / 100 * 255);
    }
  
    // Make r, g, and b fractions of 1
    let r = rgb[0] / 255,
        g = rgb[1] / 255,
        b = rgb[2] / 255;
  
    let cmin = Math.min(r,g,b),
        cmax = Math.max(r,g,b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;
    
    // Calculate hue
    // No difference
    if (delta == 0)
      h = 0;
    // Red is max
    else if (cmax == r)
      h = ((g - b) / delta) % 6;
    // Green is max
    else if (cmax == g)
      h = (b - r) / delta + 2;
    // Blue is max
    else
      h = (r - g) / delta + 4;

    h = Math.round(h * 60);
      
    // Make negative hues positive behind 360°
    if (h < 0)
      h += 360;
    
    // Calculate lightness
    l = (cmax + cmin) / 2;
    
    // Calculate saturation
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    
    // Multiply l and s by 100
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
    
    if (burn){
      l -= 10;
    } else {
      l += 10;
    }
    
    if(l > 100) l = 100;
    else if (l < 0)  l = 0;

    return "hsl(" + h + "," + s + "%," + l + "%)";
  }

  return RGBToHSL(color, burn);
}

// Disable drag event on mouse down
document.ondragstart = () => {
  return false;
}
document.ondragend = () => {
  return false;
}

createGrid();
manageCanvas();
// managePencil();
// selectColor();