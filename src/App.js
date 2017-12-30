import React, { Component } from 'react';
import './App.css';

const bonusTiles = [
  {"id": 1,
   "description": "Spade action, income 2 coins"},
  {"id": 2,
   "description": "Cult advance action, income 4 coins"},
  {"id": 3,
   "description": "Income 6 coins"},
  {"id": 4,
   "description": "Temporary +1 shipping, income of 3 power"},
  {"id": 5,
   "description": "Income 1 worker 3 power"},
  {"id": 6,
   "description": "4 VP for each of SH/SA when passing, income 2 workers"},
  {"id": 7,
   "description": "2 VP for each TP when passing, income 1 worker"},
  {"id": 8,
   "description": "Income 1 priest"},
  {"id": 9,
   "description": "1 VP for each D when passing, income 2 coins"},
  {"id": 10,
   "description": "3 VP for each shipping level when passing, income 3 power"}
]

class App extends Component {
  render() {
    return (
      <div>
        <h1>Automated Terra Mystica faction picker</h1>
        <FactionPicker />
      </div>
    );
  }
}

class FactionPicker extends Component {
  constructor(props) {
    super(props);
    const taken = [1, 2, 3, 4, 5, 6, 7].map(num => ({"no": num, "val": 0}));
    this.state = {"numPlayers": 4, "taken": taken};
    this.handleNumPlayersChange = this.handleNumPlayersChange.bind(this);
    this.handleBonusSelectionChange = this.handleBonusSelectionChange.bind(this);
  }

  handleNumPlayersChange(event) {
    var taken = this.state.taken.slice();
    while (taken.length < +event.target.value + 3) {
      let currentNum = taken[taken.length-1].no;
      taken.push({"no": currentNum+1, "val": 0})
    }
    var newTaken = [];
    for (let i=0; i<taken.length; i++) {
      if (taken[i].no <= +event.target.value + 3) {
        newTaken.push(taken[i]);
      }
    }
    this.setState({"numPlayers": +event.target.value, "taken": newTaken});
  }

  handleBonusSelectionChange(event) {
    var taken = this.state.taken.slice();
    for (let i=1; i<=this.state.numPlayers + 3; i++) {
      if (event.target.name == "bonusTileNo" + i) {
        for (let j=0; j<taken.length; j++) {
          if (taken[j].no == i) {
            taken[j].val = +event.target.value;
          }
        }
      }
    }
    this.setState({"taken": taken});
  }

  render() {
    return (
      <form>
        <Select type="numPlayers" value={this.state.numPlayers} changeHandler={this.handleNumPlayersChange}/>
        <BonusTileSelects num={this.state.numPlayers + 3} alreadySelected={this.state.taken}
        changeHandler={this.handleBonusSelectionChange}/>
      </form>
    );
  }
}

class BonusTileSelects extends Component {
  render() {
    var neededTilesArray = [];
    for (let i=0; i<this.props.num; i++) {
      neededTilesArray.push(i);
    }
    console.log(this.props.alreadySelected.length);
    return (
      neededTilesArray.map((num) => <Select type="bonusTiles" key={""+num} name={"bonusTileNo"+(num+1)}
                                    identity={num+1}
                                    changeHandler={this.props.changeHandler}
                                    alreadySelected={this.props.alreadySelected}
                                    value={this.props.alreadySelected.filter(obj => obj.no==num+1)[0].val}/>)
    );
  }
}

class Select extends Component {
  render() {
    var options, label, keys;
    if (this.props.type == "numPlayers") {
      label = "Number of players";
      options = [2, 3, 4, 5];
      keys = ["2", "3", "4", "5"];

    }
    if (this.props.type == "bonusTiles") {
      label = "Bonus tile";
      options = bonusTiles;
      keys = bonusTiles.map((tile) => tile.id);
    }
    return (
      <div>
        <label>{label}</label>
        <select onChange={this.props.changeHandler} value={this.props.value} name={this.props.name || ""}>
          <option></option>
          <OptionList identity={this.props.identity} options={options} keys={keys}
          alreadySelected={this.props.alreadySelected}/>
        </select>
      </div>
    );
  }
}

class OptionList extends Component {
  render() {
    const keys = this.props.keys;
    const alreadySelected = this.props.alreadySelected || [];
    const options = this.props.options;
    const identity = this.props.identity;
    function isOptionOK(option) {
      for (let i=0; i<alreadySelected.length; i++) {
        if (alreadySelected[i].val == option.id && alreadySelected[i].val > 0
        && alreadySelected[i].no != identity) {
          return false;
        }
      }
      return true;
    }
    const optionsToUse = options.filter(isOptionOK);    
    return (
      optionsToUse.map((option, index) => 
        <option key={keys[index]} value={option.id || index+2}>
          {option.description || option}
        </option>
      )
    );
  }
}

export default App;
