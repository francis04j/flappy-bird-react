import React, { Component } from 'react';
import './App.css';
import { setInterval } from 'timers';

function GridCell(props) {
  var style = { 
    width: 20,
    height: 20,
    border: '1px solid black',
    backgroundColor: props.cell
  }
  return (<div style={style}>
          </div>
  )
}

function GridRow(props) {
  var style = {
    display: 'flex'
   }
  return (
    <div style={style}>
      {
        props.row.map((cell) => {
          return <GridCell cell={cell} />
        })
      }
    </div>
  )
}

function Grid(props) {
  return (
    <div>
      {
        props.grid.map((row) => {
          return <GridRow row = {row} />
        })
      }
    </div>
  )
}

class Game extends React.Component {
  constructor(props) {
    super(props);

    var grid = [];
    for(let i =0; i < 20; i++) {
      grid.push(new Array(30).fill('red'));
    }
    var bird = {
      height: 10,
      position: 2
    }
    grid[bird.height][bird.position] = 'yellow';
    var towers = [
      {position: 3, height: 5, upright: false},
      {position: 5, height: 3, upright: true},
      {position: 7, height: 6, upright: false},
      {position: 10, height: 4, upright: false},
      {position: 14, height: 5, upright: true},
      {position: 18, height: 3, upright: false},
      {position: 20, height: 7, upright: true},
      {position: 22, height: 1, upright: true},
      {position: 26, height: 2, upright: false}
    ];

    this.state = {grid: grid, bird: bird, towers: towers, crashed: false, score: 0};

    this.timerId = setInterval(() => {
      if(this.state.crashed) {
        return;
      }
      //adding gravity to bird
      var gridCopy = [];
      var towersCopy = this.state.towers.slice();
      for(let i =0; i < 20; i++) {
        gridCopy.push(new Array(30).fill('red'));
      }    
      
      for(let k =0; k < towersCopy.length; k++){
        towersCopy[k].position--;
        if(towersCopy[k].position < 0){
          towersCopy[k].position = 10;          
          towersCopy[k].height = Math.floor(Math.random()*7) + 3;
        }
      }

      //loop through all towers and populate them in the grid
      for(let i =0; i < towersCopy.length; i++) {
        for(let j =0; j < towersCopy[i].height; j++) {
          if(towersCopy[i].upright){
            gridCopy[19-j][towersCopy[i].position] = 'blue';
          }else{
            gridCopy[j][towersCopy[i].position] = 'blue';
          }
        }
      }

      var crashed = false; //define this, so as to prevent calling setState; thus render multiple times
      var birdCopy = this.state.bird;
      birdCopy.height++;
      if(birdCopy.height > 19 || birdCopy.height < 0) {
        birdCopy.height = 10; //reset bird's height(position)
        crashed = true;
      }

      //collision detection
      for(let i=0; i < 20; i++) {
        if(gridCopy[i][2] == 'blue' && birdCopy.height == i) { // 2 because bird is always at column(2)
          birdCopy.height = 10;
          crashed = true;          
        }
      }
      gridCopy[birdCopy.height][birdCopy.position] = 'yellow';
      
      this.setState({grid: gridCopy,bird: birdCopy, towers: towersCopy, crashed: crashed, score: this.state.score + 1});
    }, 200);
  }

  handleClick() {
    var birdCopy = this.state.bird;
    birdCopy.height-=3
    this.setState({bird: birdCopy});
  }

  restart() {
    this.setState({crashed: false, score: 0});
  }

  render() {
    
    return (
      <div onClick = {this.handleClick.bind(this)}>
        <Grid grid = {this.state.grid}/>
        {this.state.crashed? <div><button onClick={this.restart.bind(this)}>Restart game </button>{this.state.score}</div> : this.state.score}
      </div>
    )
  }
}
export default Game;
