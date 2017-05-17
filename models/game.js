var fs = require('fs')

class Game {
  constructor(id) {
    this.partyMembers = [] //array of each partyMember (object)
    this.supplies = {
      oxen: Math.floor(Math.random() * 10) + 1,
      wagonAxels: Math.floor(Math.random() * 5) + 1,
      wagonWheels: Math.floor(Math.random() * 6) + 1,
      wagonTongues: Math.floor(Math.random() * 10) + 1,
      setsClothing: Math.floor(Math.random() * 20) + 1,
      bullet: Math.floor(Math.random() * 500) + 1,
      poundsFood: Math.floor(Math.random() * 200) + 101
    }
    this.recentlyBroken = ""
    this.recentlyRecovered = ""
    this.recentlyDeceased = ""
    this.recentlyFellIll = ""
    this.brokeDown = false
    this.locations = [{
        name: "Death Valley",
        source: "http://mustseeplaces.eu/wp-content/uploads/2015/03/death-valley-national-park-panorama.jpg"
      },
      {
        name: "Gods Terrarium",
        source: "http://www.cactuslovers.com/tucson-cactus-rescue/tucson-cactus-rescue17.jpg"
      },
      {
        name: "Villagers Rock",
        source: "http://www.redcliffsdesertreserve.com/wp-content/uploads/2013/04/Web-13-Beatuiful-red-rock-views-along-trail.jpg"
      },
      {
        name: "Fort Armado",
        source: "https://s-media-cache-ak0.pinimg.com/originals/c1/e8/63/c1e863286a56f55b68e31a317d9ea97b.jpg"
      },
      {
        name: "Rivers Edge",
        source: "https://s3.amazonaws.com/american-rivers-website/wp-content/uploads/2016/03/24220023/Crystal_River_at_Redstone_CO-credit-Dave-Dugdale-header.jpg"
      },
      {
        name: "Gold Mine",
        source: "https://www.ausgamers.com/gameres/5733/images/source/callofjuarezgunslinger_04.jpg"
      },
      {
        name: "Smith Forge",
        source: "https://c1.staticflickr.com/9/8048/8130886265_aa7320dc9e_b.jpg"
      },
      {
        name: "Fort Smith",
        source: "https://civilwartalk.com/attachments/fort-taber-jpg.58968/"
      },
      {
        name: "Traders Ridge",
        source: "http://www.blackhillsbadlands.com/sites/default/files/styles/hero_image/public/photos/business/street_pic_1.jpg?itok=aryYNexI&timestamp=1454023032"
      },
      {
        name: "Dead Mans Road",
        source: "http://bh-s2.azureedge.net/bh-uploads/2015/11/BT_Skull-1050x525.jpg"
      }
    ] // all the locations in the game
    this.daysSpent = 0;
    this.currentLocation = 0; // index of the locations array
    this.diseases = [{
        name: "cholera",
        chance: 30
      },
      {
        name: "dysentery",
        chance: 20
      },
      {
        name: "broken leg",
        chance: 80
      },
      {
        name: "broken arm",
        chance: 60
      },
      {
        name: "bitten by snake",
        chance: 100
      },
      {
        name: "influenza",
        chance: 20
      },
      {
        name: "spontaneous combustion",
        chance: 5000
      }
    ]
    if (id === undefined) {
      this.id = Date.now()
    } else {
      this.id = id
    }
  }

  save() {
    fs.writeFileSync('game' + this.id + '.json', JSON.stringify(this))
  }
  load() {
    var rawFile = fs.readFileSync('game' + this.id + '.json')
    var tempGame = JSON.parse(rawFile)
    this.partyMembers = tempGame.partyMembers
    this.supplies = tempGame.supplies
    this.locations = tempGame.locations
    this.daysSpent = tempGame.daysSpent
    this.currentLocation = tempGame.currentLocation
    this.brokeDown = tempGame.brokeDown
  }
  checkWagon() {
    let allSupplies = Object.getOwnPropertyNames(this.supplies)
    for (var i = 0; i < 4; i++) {
      if (this.getBroke(10)) {
        let selectedSupply = allSupplies[i]
        this.supplies[selectedSupply] -= 1
        if (this.supplies[selectedSupply] < 0) {
          this.brokeDown = true
        }
        this.recentlyBroken = selectedSupply
        return true
      }
    }
    return false
  }
  checkLose() {
    if (this.bodyCount() == 0 || this.supplies.poundsFood <= 0 || this.brokeDown) {
      return true
    }
    return false
  }
  bodyCount() {
    let headCount = 0
    this.partyMembers.forEach(function(member) {
      if (member.status !== "dead") {
        headCount++
      }
    })
    return headCount
  }
  diseaseRecovery(chance, partyMemberIndex) {
    let i = partyMemberIndex
    let randomNum = Math.floor(Math.random() * chance) + 1
    if (randomNum === 1) {
      this.partyMembers[i].disease = ""
      this.partyMembers[i].status = "well"
      this.recentlyRecovered = this.partyMembers[i].name
      return true
    }
  }

  die(chance, partyMemberIndex) {
    let i = partyMemberIndex
    let randomNum = Math.floor(Math.random() * chance) + 1
    if (randomNum === 1) {
      this.partyMembers[i].status = "dead";
      this.recentlyDeceased = this.partyMembers[i].name
      return true
    }
    return false
  }
  getBroke(chance) {
    //let i = partyMemberIndex
    let randomNum = Math.floor(Math.random() * chance) + 1
    if (randomNum === 1) {
      return true
    }
    return false
  }

  getSick(chance) {
    //let i = partyMemberIndex
    let randomNum = Math.floor(Math.random() * chance) + 1
    if (randomNum === 1) {
      return true
    }
    return false
  }

  checkSick() {
    for (var i = 0; i < this.partyMembers.length; i++) {
      if (this.partyMembers[i].status == "well") {
        for (var j = 0; j < this.diseases.length; j++) {
          if (this.getSick(this.diseases[j].chance)) {
            this.partyMembers[i].status = "sick";
            this.partyMembers[i].disease = this.diseases[j].name;
            this.recentlyFellIll = this.partyMembers[i]
            return true;
          }
        }
      }
    }
    return false;
  }


  checkDead() {
    for (var i = 0; i < this.partyMembers.length; i++) {
      if (this.partyMembers[i].status == "sick") {
        switch (this.partyMembers[i].disease) {
          case "dysentery":
            if (this.die(6, i)) {
              return true
            }
            break;
          case "cholera":
            if (this.die(6, i)) {
              return true
            }
            break;
          case "broken leg":
            if (this.die(20, i)) {
              return true
            }
            break;
          case "broken arm":
            if (this.die(100, i)) {
              return true
            }
            break;
          case "bitten by snake":
            if (this.die(4, i)) {
              return true
            }
            break;
          case "influenza":
            if (this.die(50, i)) {
              return true
            }
            break;
          case "spontaneous combustion":
            if (this.die(1, i)) {
              return true
            }
            break;
          default:
            break;
        }
      }
    }
    return false
  }
  checkRecovered() {
    for (var i = 0; i < this.partyMembers.length; i++) {
      if (this.partyMembers[i].status == "sick") {
        switch (this.partyMembers[i].disease) {
          case "dysentery":
            if (this.diseaseRecovery(4, i)) {
              return true
            }
            break;
          case "cholera":
            if (this.diseaseRecovery(20, i)) {
              return true
            }
            break;
          case "broken leg":
            if (this.diseaseRecovery(5, i)) {
              return true
            }
            break;
          case "broken arm":
            if (this.diseaseRecovery(3, i)) {
              return true
            }
            break;
          case "bitten by snake":
            if (this.diseaseRecovery(10, i)) {
              return true
            }
            break;
          case "influenza":
            if (this.diseaseRecovery(3, i)) {
              return true
            }
            break;
          default:
            break;
        }
      }
    }
    return false
  }
  takeTurn() {
    if (this.currentLocation === this.locations.length - 1) {
      return "game-won"
    }
    if (this.checkLose()) {
      return "lose"
    }
    if (this.checkDead()) {
      this.daysSpent += 5;
      this.supplies.poundsFood -= (2 * this.bodyCount());
      if (this.supplies.poundsFood < 0) {
        this.supplies.poundsFood = 0
      }
      return "dead"
    }
    if (this.checkRecovered()) {
      return "recovered"
    }
    if (this.checkSick()) {
      this.daysSpent += 2;
      this.supplies.poundsFood -= (1 * this.bodyCount());
      if (this.supplies.poundsFood < 0) {
        this.supplies.poundsFood = 0
      }
      return "sick"
    }
    if (this.checkWagon()) {
      return "broke"
    }
    //check if recovered
    //check if sick
    // check if dead

    //check if damage
    //decrement supplies
    //if all false, next location
    this.currentLocation++;
    this.supplies.poundsFood -= (5 * this.bodyCount());
    if (this.supplies.poundsFood < 0) {
      this.supplies.poundsFood = 0
    }
    this.daysSpent += 10
    return 'location'
  }
}

module.exports = Game
