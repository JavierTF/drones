import {
  validateSerialNumber,
  validateRange,
  validateString,
} from "../lib/utiles";

import { Drone } from "../src/app/AddDrone";

import { medications } from "../src/app/medications";

const serials = ["ert_ert", "d-45a", "cgfg"];
const drone = new Drone("wer", "Middleweight", 250, 99, "DELIVERED");

function verifyInputOutputIsJSON(ioput) {
  let parsedIOput = null;
  let isJSON = true;

  try {
    parsedIOput = JSON.stringify(ioput);
  } catch (error) {
    isJSON = false;
  }

  expect(isJSON).toBe(true);
  expect(parsedIOput).toBeDefined();
}

describe("testing...", () => {
  describe("testing drones", () => {
    it("validates drone params creation", () => {
      expect(drone).toBeInstanceOf(Drone);
      expect(drone).toHaveProperty("serial_number");
      expect(drone).toHaveProperty("model");
      expect(drone).toHaveProperty("weight_limit");
      expect(drone).toHaveProperty("battery_capacity");
      expect(drone).toHaveProperty("state");
      expect(typeof drone.serial_number).toBe("string");
      expect(typeof drone.model).toBe("number");
      expect(typeof drone.weight_limit).toBe("number");
      expect(typeof drone.battery_capacity).toBe("number");
      expect(typeof drone.state).toBe("number");
    });

    it("Input/Output data must be in JSON format;", () => {
      verifyInputOutputIsJSON(medications);
    });

    it("length of the serial number less than or equal to 100 and defined", () => {
      const res = validateSerialNumber("asd", serials);
      expect("asd").toBeDefined();
      expect("asd".length).toBeLessThanOrEqual(100);
      expect(Array.isArray(serials)).toBe(true);
      expect(serials).not.toContain("asd");
      expect(res).toBe(true);
    });

    it("weight limit less than or equal 500 and greater than 0", () => {
      const result = validateRange(drone.weight_limit, 500);
      expect(drone).toHaveProperty("weight_limit");
      expect(drone.weight_limit).toBeLessThanOrEqual(500);
      expect(drone.weight_limit).toBeGreaterThan(0);
      expect(result).toBe(true);
    });

    it("battery capacity less than or equal to 100 and greater than or equal 0", () => {
      const result = validateRange(drone.battery_capacity, 100);
      expect(drone).toHaveProperty("battery_capacity");
      expect(drone.battery_capacity).toBeLessThanOrEqual(100);
      expect(drone.battery_capacity).toBeGreaterThanOrEqual(0);
      expect(result).toBe(true);
    });
  });

  describe("testing medications", () => {
    it("validates property name and string with letters, numbers, - and _", () => {
      const regex = /^[a-zA-Z0-9\-_]+$/;
      const result = validateString('Femtest', regex);
      expect('Femtest').toMatch(regex);
      expect(result).toBe(true);
    });

    it("validates medication object with code property FALSY", () => {
      const regex = /^[A-Z0-9_]+$/;
      const result = validateString('xa344', regex);
      expect('xa344').not.toMatch(regex);
      expect(result).toBe(false);
    });
  });
});
