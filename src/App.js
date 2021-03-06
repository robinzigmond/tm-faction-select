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
];

const scoringTiles = [
  {"id": 1,
   "description": "2VP/Dwelling, 1P per 4 Water"},
  {"id": 2,
   "description": "2VP/Dwelling, 4PW per 4 Fire"},
  {"id": 3,
   "description": "3VP/TP, 1 spade per 4 Air"},
  {"id": 4,
   "description": "3VP/TP, 1 spade per 4 Water"},
  {"id": 5,
   "description": "5VP per SH/SA, 1W per 2 Air"},
  {"id": 6,
   "description": "5VP per SH/SA, 1W per 2 Fire"},
  {"id": 7,
   "description": "2VP/spade, 1C per 1 Earth"},
  {"id": 8,
   "description": "5VP/TW, 1 spade per 4 Earth"},
  {"id": 9,
   "description": "4VP/TE, 2 coins per cult priest"}
];

// scores for how much each faction "likes" or "dislikes" features of the setup
// scores for bonuses go up to +-10, those for each round go up to the round number in absolute value
const suitability = [
  {"name": "Alchemists", "colour": 1,
                         "bonuses": [3, -6, -10, 2, 8, 10, 4, 5, 5, 4],
                         "scoringRound1": [0, 0, 0, 0, 1, 1, 0, 0, -1],
                         "scoringRound2": [1, 1, -1, -1, -2, 0, 1, 1, 1],
                         "scoringRound3": [3, 3, -3, -1, 1, 1, 1, 1, -1],
                         "scoringRound4": [4, 4, -4, -4, -2, -2, 4, -2, -4],
                         "scoringRound5": [2, 2, 4, 5, -3, 0, 0, 2, -3],
                         "scoringRound6": [3, 3, 6, 6, -4, -4, 0, 4, -3]}, // total: 46
  {"name": "Auren", "colour": 3,
                    "bonuses": [2, 3, 2, 6, 4, 5, -2, 3, 0, 0],
                    "scoringRound1": [1, 0, 1, 1, 1, 1, -1, -1, -1],
                    "scoringRound2": [1, 0, 1, 1, 1, 0, -1, -2, 0],
                    "scoringRound3": [1, 1, -2, -2, -3, -3, -1, 0, 0],
                    "scoringRound4": [1, 1, 0, 0, -2, -3, -2, 0, -1],
                    "scoringRound5": [1, 1, 1, 1, -3, -4, 0, 0, 0],
                    "scoringRound6": [1, 1, 1, 1, -1, -1, 0, 0, 0]}, // total: 10
  {"name": "Chaos Magicians", "colour": 5,
                              "bonuses": [7, 6, 6, 9, 5, 8, -6, -2, 0, 7],
                              "scoringRound1": [0, 1, 0, 0, 1, 1, 0, 0, 0],
                              "scoringRound2": [0, 1, -2, -2, 1, 2, 0, -2, 1],
                              "scoringRound3": [2, 3, -1, -1, -3, -2, 0, -2, -1],
                              "scoringRound4": [3, 4, 0, 0, -4, -4, 1, 1, 1],
                              "scoringRound5": [0, 2, 2, 2, -4, -4, 0, 2, 0],
                              "scoringRound6": [0, 0, 2, 2, -3, -3, 0, 1, 3],}, // total: 41
  {"name": "Cultists", "colour": 0,
                       "bonuses": [4, 7, 6, 0, 5, -6, -1, 8, 2, -2],
                       "scoringRound1": [0, 0, 0, 0, -1, 0, 1, 1, 0],
                       "scoringRound2": [0, 1, -1, -1, 0, -1, 1, 1, 1],
                       "scoringRound3": [2, 3, 1, 1, -2, -1, -2, -1, 2],
                       "scoringRound4": [2, 3, 1, 1, -1, 0, -3, 2, 2],
                       "scoringRound5": [3, 4, 3, 3, 1, 2, 0, 4, 2],
                       "scoringRound6": [3, 3, 4, 4, 5, 5, 0, 3, 0]} // total: 84
];

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
    const bonTaken = [1, 2, 3, 4, 5, 6, 7].map(num => ({"no": num, "val": 0}));
    const scoreTaken = [1, 2, 3, 4, 5, 6].map(num => ({"no": num, "val": 0}));
    this.state = {"numPlayers": 4, "bonusesTaken": bonTaken, "scoringTilesTaken": scoreTaken};
    this.handleNumPlayersChange = this.handleNumPlayersChange.bind(this);
    this.handleBonusSelectionChange = this.handleBonusSelectionChange.bind(this);
    this.handleScoringSelectionChange = this.handleScoringSelectionChange.bind(this);
  }

  handleNumPlayersChange(event) {
    var taken = this.state.bonusesTaken.slice();
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
    this.setState({"numPlayers": +event.target.value, "bonusesTaken": newTaken});
  }

  handleBonusSelectionChange(event) {
    var taken = this.state.bonusesTaken.slice();
    for (let i=1; i<=this.state.numPlayers + 3; i++) {
      if (event.target.name == "bonusTileNo" + i) {
        for (let j=0; j<taken.length; j++) {
          if (taken[j].no == i) {
            taken[j].val = +event.target.value;
          }
        }
      }
    }
    this.setState({"bonusesTaken": taken});
  }

  handleScoringSelectionChange(event) {
    var taken = this.state.scoringTilesTaken.slice();
    for (let i=1; i<=6; i++) {
      if (event.target.name == "scoringTileRound" + i) {
        for (let j=0; j<taken.length; j++) {
          if (taken[j].no == i) {
            taken[j].val = +event.target.value;
          }
        }
      }
    }
    this.setState({"scoringTilesTaken": taken});    
  }

  render() {
    return (
      <form>
        <Select type="numPlayers" value={this.state.numPlayers} changeHandler={this.handleNumPlayersChange}/>
        <BonusTileSelects num={this.state.numPlayers + 3} alreadySelected={this.state.bonusesTaken}
        changeHandler={this.handleBonusSelectionChange}/>
        <ScoringTileSelects alreadySelected={this.state.scoringTilesTaken}
        changeHandler={this.handleScoringSelectionChange}/>
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
    return (
      neededTilesArray.map((num) => <Select type="bonusTiles" key={""+num} name={"bonusTileNo"+(num+1)}
                                    identity={num+1}
                                    changeHandler={this.props.changeHandler}
                                    alreadySelected={this.props.alreadySelected}
                                    value={this.props.alreadySelected.filter(obj => obj.no==num+1)[0].val}/>)
    );
  }
}

class ScoringTileSelects extends Component {
  render() {
    var neededTilesArray = [0,1,2,3,4,5];
    return (
      neededTilesArray.map((num) => <Select type="scoringTiles" key={""+num} name={"scoringTileRound"+(num+1)}
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
    else if (this.props.type == "bonusTiles") {
      label = "Bonus tile";
      options = bonusTiles;
      keys = bonusTiles.map((tile) => tile.id);
    }
    else if (this.props.type == "scoringTiles") {
      label = "Scoring tile for Round " + this.props.identity;
      options = scoringTiles;
      keys = scoringTiles.map((tile) => tile.id);
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
      // eliminate selections already taken by others in the same section
      for (let i=0; i<alreadySelected.length; i++) {
        if (alreadySelected[i].val == option.id && alreadySelected[i].val > 0
        && alreadySelected[i].no != identity) {
          // but we musn't eliminate an option from Round 6 unless BOTH tiles with the 
          // same scoring category have already been taken. (In the 3 cases where there
          // are 2 with the same scoring.)
          if (options == scoringTiles && alreadySelected[i].no == 6 && alreadySelected[i].val < 7) {
            // pairs are (1, 2), (3, 4), (5, 6)
            let evenOrOdd = alreadySelected[i].val % 2;
            let pairing = 2*Math.floor((alreadySelected[i].val-1)/2) + 1 + evenOrOdd;
            for (let j=0; j<alreadySelected.length; j++) {
              if (alreadySelected[j].val == pairing) {
                return false;
              }
            }
          }
          else {
            return false;
          }
        }
      }
      // eliminate spade scoring tile from round 5 or 6
      if (options == scoringTiles && identity > 4 && option.id == 7) {
        return false;
      }
      return true;
    }
    const optionsToUse = options.filter(isOptionOK);
    // reformat options list for Round 6 scoring tile, where cult bonus is irrelevant:
    var displayedOptions;
    if (options == scoringTiles && identity == 6) {
      displayedOptions = [];
      let optionsUsed = [];
      for (let i=0; i<optionsToUse.length; i++) {
        let option = optionsToUse[i];
        if (optionsUsed.indexOf(option.description.split(",")[0]) == -1) {
          let description = option.description.split(",")[0];
          let truncatedOption = {"id": option.id, "description": description};
          displayedOptions.push(truncatedOption);
          optionsUsed.push(description);
        }
      }
    }
    else {
      displayedOptions = optionsToUse;
    }    
    return (
      displayedOptions.map((option, index) => 
        <option key={keys[index]} value={option.id || index+2}>
          {option.description || option}
        </option>
      )
    );
  }
}

export default App;
