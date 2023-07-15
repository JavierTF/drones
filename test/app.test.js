function verifyInputOutputIsJSON(ioput) {
  let parsedIOput = null;
  let isJSON = true;

  try {
    parsedIOput = JSON.parse(ioput);
  } catch (error) {
    isJSON = false;
  }

  expect(isJSON).toBe(true);
  expect(parsedIOput).toBeDefined();
}

import {
  validateSerialNumber,
} from "../lib/utiles";

describe("testing...", () => {
  describe("testing drones", () => {
    it("validates drone params creation", () => {
        const drone = nameFunction(drone);
        
        expect(drone).toHaveProperty("serial_number");
        expect(drone).toHaveProperty("model");
        expect(drone).toHaveProperty("weight_limit");
        expect(drone).toHaveProperty("battery_capacity");
        expect(drone).toHaveProperty("state");
        expect(typeof drone.serial_number).toBe('string');
        expect(typeof drone.model).toBe('string');
        expect(typeof drone.weight_limit).toBe('number');
        expect(typeof drone.battery_capacity).toBe('number');
        expect(typeof drone.state).toBe('string');
    });

    it('Input/Output data must be in JSON format;', () => {
        const input = '{"key": "value"}';
      
        verifyInputOutputIsJSON(input);
    });

    it("drones is array", () => {
      const arr = nameFunction([]);
      expect(arr).toBeArray();
    });

    it("checks if drone is an object and instance of Drone", () => {
      const obj = {};
      expect(obj).toBeObject();
      expect(obj).toBeInstanceOf(Drone);
    });

    it("number of drones lower or equal to 10", () => {
      const arr = nameFunction([{}]);
      expect(arr.length).toBeLessThanOrEqual(10);
    });

    it.only("length of the serial number less than or equal to 100 and defined", () => {
      const serial_number = validateSerialNumber('asd');
      expect(serial_number).toBeDefined();
      expect(serial_number.length).toBeLessThanOrEqual(100);
    });

    it("model value is one of the valid options", () => {
      const drone = nameFunction(drone);
      const validModels = [
        "Lightweight",
        "Middleweight",
        "Cruiserweight",
        "Heavyweight",
      ];
      expect(drone).toHaveProperty("model");
      expect(validModels).toContain(drone.model);
    });

    it("weight limit less than or equal 500 and greater than 0", () => {
      const drone = nameFunction(drone);
      expect(drone).toHaveProperty("weight_limit");
      expect(weight_limit).toBeLessThanOrEqual(500);
      expect(weight_limit).toBeGreaterThan(0);
    });

    it("battery capacity less than or equal to 100 and greater than or equal 0", () => {
      const drone = nameFunction(drone);
      expect(drone).toHaveProperty("battery_capacity");
      expect(battery_capacity).toBeLessThanOrEqual(100);
      expect(battery_capacity).toBeGreaterThanOrEqual(0);
    });

    it("validates property state and checks if is one of the valid options", () => {
      const drone = nameFunction(drone);
      const validStates = [
        "IDLE",
        "LOADING",
        "LOADED",
        "DELIVERING",
        "DELIVERED",
        "RETURNING",
      ];
      expect(drone).toHaveProperty("state");
      expect(validStates).toContain(drone.state);
    });

    it("Prevent the drone from being loaded with more weight that it can carry", () => {
      const drone = nameFunction(drone);
      let flag = true;
      if (drone.state === "LOADING" && drone.medication.length !== 0) {
        let sum = 0;
        for (let med of drone.medication) {
          sum += med.weight;
          if (suma > drone.weight_limit) {
            flag = false;
            break;
          }
        }
      }
      expect(drone).toHaveProperty("state");
      expect(drone).toHaveProperty("medication");
      expect(drone.medication).toHaveProperty("weight");
      expect(flag).toBeTruthy();
    });

    it("checking loaded medication items for a given drone", () => {
      const drone = nameFunction(drone);
      let flag = true;

      if (drone.state === "LOADED" && drone.medication.length === 0) {
        flag = false;
      }

      expect(drone).toHaveProperty("state");
      expect(drone).toHaveProperty("medication");
      expect(drone.medication).toBeArray();
      expect(flag).toBeTruthy();
    });

    it("Prevent the drone from being in LOADING state if the battery level is below 25%", () => {
      const drone = nameFunction(drone);
      let flag = true;

      if (drone.state === "LOADING" && drone.battery_capacity < 25) {
        flag = false;
      }

      expect(drone).toHaveProperty("state");
      expect(drone).toHaveProperty("battery_capacity");
      expect(flag).toBeTruthy();
    });

    /*
            FUNCION PARA EL BATTERY LOG;
            FUNCION PARA EL BATTERY LOG;
            FUNCION PARA EL BATTERY LOG;
        */

    
  });

  describe("testing medications", () => {
    it("validates medication params creation", () => {
        const medication = nameFunction(medication);

        expect(medication).toHaveProperty("name");
        expect(medication).toHaveProperty("weight");
        expect(medication).toHaveProperty("weight_limit");
        expect(medication).toHaveProperty("battery_capacity");
        expect(typeof medication.name).toBe('string');
        expect(typeof medication.weight).toBe('number');
        expect(typeof medication.code).toBe('string');
        expect(typeof medication.image).toBe('string');
    });

    it("medications is an array", () => {
      const arr = nameFunction([]);
      expect(arr).toBeArray();
    });

    it("checks if medication is an object and instance of Medication", () => {
      const obj = {};
      expect(obj).toBeObject();
      expect(obj).toBeInstanceOf(Medication);
    });

    it("validates property name and string with letters, numbers, - and _", () => {
      const regex = /^[a-zA-Z0-9\-_]+$/;

      const medication = nameFunction(medication);
      expect(medication).toHaveProperty("name");
      expect(medication.name).toMatch(regex);
    });

    it("validates property weight and medication weight greater than 0", () => {
      const medication = nameFunction(medication);
      expect(medication).toHaveProperty("weight");
      expect(medication.weight).toBeGreaterThan(0);
    });

    it("validates medication object with code property", () => {
      const regex = /^[A-Z0-9_]+$/;

      const medication = nameFunction(medication);
      expect(medication).toHaveProperty("code");
      expect(medication.code).toMatch(regex);
    });

    it("validates medication object with image property and extension", () => {
        const medication = nameFunction(medication);
        let flag = true;

        if (medication.image != null){
            const arr = medication.image.split('.');
            const ext = arr.pop();
            const validFormats = [
                "jpg",
                "jpeg",
                "png",
                "webp",
            ];
            flag = validFormats.includes(ext);
        }
        
        expect(medication).toHaveProperty("image");
        expect(flag).toBeTruthy();
      });
  });
});