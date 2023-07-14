function Drone(serial_number, model, weight_limit, battery_capacity, state, medication = null) {
  this.serial_number = serial_number;
  this.model = setModel(model);
  this.weight_limit = weight_limit;
  this.battery_capacity = battery_capacity;
  this.state = setState(state);
  this.medication = setMedication(medication);

  function setModel(model) {
    if (model === "Lightweight") {
      return 1;
    } else if (model === "Middleweight") {
      return 2;
    } else if (model === "Cruiserweight") {
      return 3;
    } else if (model === "Heavyweight") {
      return 4;
    } else {
      return null;
    }
  }

  function setState(state) {
    if (state === "IDLE") {
      return 1;
    } else if (state === "LOADING") {
      return 2;
    } else if (state === "LOADED") {
      return 3;
    } else if (state === "DELIVERING") {
      return 4;
    } else if (state === "DELIVERED") {
      return 5;
    } else if (state === "RETURNING") {
      return 6;
    } else {
      return null;
    }
  }

//   function setMedication(medication) {
//     if (medication != null) {
//       for (let elem of medication){
//         this.medication.push(elem);
//       }
//     }
//   }
}

function Medication(name, weight, code, image) {
    this.name = name;
    this.weight = weight;
    this.code = code;
    this.image = image;
}
