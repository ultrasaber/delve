function randomInt(min, max) {
  return Math.floor((Math.random() * max) + min);
}

class Cell {
  constructor(isWall) {
    this.isWall = isWall;
  }
}

class Room {
  constructor(originX, originY, width, height) {
    this.originX = originX;
    this.originY = originY;
    this.width = width;
    this.height= height;
  }
}

class HallSegment {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return "HallSegment: (" + this.x + ", " + this.y + ")";
  }
}

class Hall {
  constructor(startX, startY, endX, endY) {
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
    this.segments = [];
  }

  drawPath() {
    var x = this.startX;
    var y = this.startY;
    this.segments = [];

    while (x != this.endX || y != this.endY) {
      if (x == this.endX) {
        y += this.endY > y ? 1 : -1;
      } else if (y == this.endY) {
        x += this.endX > x ? 1 : -1;
      } else {
        if (randomInt(1,2) == 1) {
          x += this.endX > x ? 1 : -1;
        } else {
          y += this.endY > y ? 1 : -1;
        }
      }

      this.segments.push(new HallSegment(x,y));
    }
  }
}

class Map {
  constructor(width, height, roomCount, hallCount) {
    this.cells = [];
    this.width = width;
    this.height = height;
    this.rooms = [];
    this.halls =[];

    // fill the map with walls
    for (var w = 0; w < width; w++) {
      this.cells[w] = [];

      for (var h = 0; h < height; h++) {
        this.cells[w][h] = new Cell(true);
      }
    }

    // punch out some rooms
    for (var r = 0; r < roomCount; r++) {
      this.rooms[r] = this.generateRoom();

      for (var x = this.rooms[r].originX - this.rooms[r].width; x < this.rooms[r].originX + this.rooms[r].width; x++) {
        for (var y = this.rooms[r].originY - this.rooms[r].height; y < this.rooms[r].originY + this.rooms[r].height; y++) {
          try {
            this.cells[x][y].isWall = false;
          } catch(err) {
            //console.log(err);
            continue;
          }
        }
      }
    }

    // deck the halls
    console.log(this);

    for (var h = 0; h < hallCount; h++) {
      var rand1 = randomInt(0,this.rooms.length);
      var rand2 = randomInt(0,this.rooms.length);

      this.halls[h] = new Hall(this.rooms[rand1].originX, this.rooms[rand1].originY, this.rooms[rand2].originX, this.rooms[rand2].originY);
      this.halls[h].drawPath();

      for (var c = 0; c < this.halls[h].segments.length; c++) {
        //console.log(this.halls[h].segments[c].toString());
        this.cells[this.halls[h].segments[c].x][this.halls[h].segments[c].y].isWall = false;
      }
    }
  }

  generateRoom() {
    return new Room(randomInt(0, this.width-1), randomInt(0, this.height-1), randomInt(2, 4), randomInt(2, 4));
  }

  toString() {
    var output = "";

    for (var h = 0; h < this.height; h++) {
      for (var w = 0; w < this.width; w++) {
        output += this.cells[w][h].isWall ? "#" : " ";
      }
      output += "\n";
    }

    return output;
  }
}

class Viewport {
  constructor(width, height, elementId, map, offsetX, offsetY) {
    this.width = width;
    this.height = height;
    this.elementId = elementId;
    this.map = map;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }

  createViewport() {
    for (var h = 0; h < this.height; h++) {
      var tr = document.createElement("tr");
      tr.setAttribute("class","_" + h);

      for (var w = 0; w < this.width; w++) {
        var td = document.createElement("td");
        td.setAttribute("class","_" + w);

        tr.appendChild(td);
      }

      document.getElementById(this.elementId).appendChild(tr);
    }
  }

  drawMapArea() {
    //console.log("afkjhblawdkvdv");
    for (var r = 0; r < this.height; r++) {
      //console.log("r: " + r);
      for (var c = 0; c < this.width; c++) {
        //console.log("c:" + c);

        try {
          //console.log("Viewport X: "+c+", Viewport Y: "+r+" , Map X:"+((c - Math.floor(this.width/2)) + this.offsetX)+" , Map Y: "+((r - Math.floor(this.height/2)) + this.offsetY));
          if (this.map.cells[(c - Math.floor(this.width/2)) + this.offsetX][(r - Math.floor(this.height/2)) + this.offsetY].isWall) {
            document.querySelector("#viewport tr._" + r + " td._" + c).setAttribute("class","_" + c + " wall");
          } else {
            document.querySelector("#viewport tr._" + r + " td._" + c).setAttribute("class","_" + c);
          }
        } catch (err) {
          //console.log(err);
          document.querySelector("#viewport tr._" + r + " td._" + c).setAttribute("class","_" + c + " wall");
          continue;
        }
      }
    }
  }

  north() {
    this.offsetY -= 1;
    this.drawMapArea();
  }

  south() {
    this.offsetY += 1;
    this.drawMapArea();
  }

  east() {
    this.offsetX += 1;
    this.drawMapArea();
  }

  west() {
    this.offsetX -= 1;
    this.drawMapArea();
  }
}

var map = new Map(50, 50, 10, 10);
var viewport = new Viewport(9,9,"viewport", map, map.rooms[0].originX, map.rooms[0].originY);

window.onload = function() {
  document.getElementById("map").innerHTML = map.toString();
  viewport.createViewport();
  viewport.drawMapArea();

  document.getElementById("north").onclick = function () {
    viewport.north();
  };
  document.getElementById("south").onclick = function () {
    viewport.south();
  };
  document.getElementById("east").onclick = function () {
    viewport.east();
  };
  document.getElementById("west").onclick = function () {
    viewport.west();
  };
};
