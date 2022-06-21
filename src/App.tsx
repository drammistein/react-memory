import { useEffect, useState } from 'react';
import * as C from './App.styles';

import logoImage from './assets/devmemory_logo.png';
import RestartIcon from './svgs/restart.svg';

import { Button } from './components/Button';
import { InfoItem } from './components/InfoItem';
import { GridItem } from './components/GridItem';

import { GridItemType } from './types/GridItemType';
import { items } from './data/items';
import { formatTimeElapsed } from './helpers/formatTimeElapsed';

const App = () => {
  const [playing, setPlaying] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [moveCount, setMoveCount] = useState<number>(0);
  const [showCount, setShowCount] = useState<number>(0);
  const [gridItems, setGridItems] = useState<GridItemType[]>([]);

  useEffect(() => {
    resetAndCreateGrid();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if(playing) {
        setTimeElapsed(timeElapsed + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [playing, timeElapsed]);

  // Vai verificar se os campos escolhidos são iguais
  useEffect(() => {
    if(showCount === 2) {
      let opened = gridItems.filter(item => item.shown === true);
      if(opened.length === 2) {
        // Verificação 1: se for iguais torna-os permanentes
        let tmpGrid = [...gridItems];//clonando
        if(opened[0].item === opened[1].item) {
          for(let i in tmpGrid) {
            if(tmpGrid[i].shown) {
              tmpGrid[i].permanentShown = true;
              tmpGrid[i].shown = false;
            }
          }
          setGridItems(tmpGrid);
          setShowCount(0);
        } else {
          setTimeout(() => {
            // Verificação 2: se não forem iguais fecha-os
          let tmpGrid = [...gridItems];//clonando
          for(let i in tmpGrid ) {
            tmpGrid[i].shown = false;
          }
          setGridItems(tmpGrid);
          setShowCount(0);
          }, 1000);
        }
                
        //Vai contar os movimentos a cada duas cartas
        setMoveCount(moveCount => moveCount +1);
      }
    }
  }, [showCount, gridItems]); //Irão ser monitorados
  
  // Vai verificar se o jogo terminou
  useEffect(() => {
    if(moveCount > 0 && gridItems.every(item => item.permanentShown === true)) {
      setPlaying(false);
    }
  }, [moveCount, gridItems]);

  const resetAndCreateGrid = () => {
    // passo 1 - resetar o jogo
    setTimeElapsed(0);
    setMoveCount(0);
    setShowCount(0);
    
    // passo 2 - criar o grid vazio
    // passo 2.1 - criar um grid vazio
    let tmpGrid: GridItemType[] = [];
    for(let i = 0; i < (items.length * 2); i++) {
      tmpGrid.push({
        item: null,
        shown: false,
        permanentShown: false
      });
    }
    // passo 2.2 - preencher o grid
    for(let w = 0; w < 2; w++) { //  vair rodar o loop 2x 
      for(let i = 0; i < items.length; i++) {
        let pos = -1;
        // Verificar se a posição está preenchida
        while(pos < 0 || tmpGrid[pos].item !== null) {
          pos = Math.floor(Math.random() * (items.length * 2));
        }
        tmpGrid[pos].item = i;
      }
    }
    // passp 2.3 - jogar no state
    setGridItems(tmpGrid);
    // passo 3 - começar  jogo
    setPlaying(true);
  }

  const handleItemClick = (index: number) => {
    if(playing && index !== null && showCount < 2) {
      let tmpGrid = [...gridItems];
      if(tmpGrid[index].permanentShown === false && tmpGrid[index].shown === false) {
        tmpGrid[index].shown = true;
        setShowCount(showCount + 1);
      }  
      setGridItems(tmpGrid);
    }
  }

  return (
    <C.Container>
      <C.Info>
        <C.LogoLink href="">
          <img src={logoImage} width="200" alt="" />
        </C.LogoLink>

        <C.InfoArea>
          <InfoItem label="Tempo" value={formatTimeElapsed(timeElapsed)} />
          <InfoItem label="Movimentos" value={moveCount.toString()} />
        </C.InfoArea>

        <Button label="Reiniciar" icon={RestartIcon} onClick={resetAndCreateGrid} />

      </C.Info>
      <C.GridArea>
        <C.Grid>
          {gridItems.map((item, index) => (
            <GridItem 
              key={index}
              item={item}
              onClick={() => handleItemClick(index)}
            />
          ))}
        </C.Grid>
      </C.GridArea>
    </C.Container>
  );
}

export default App;