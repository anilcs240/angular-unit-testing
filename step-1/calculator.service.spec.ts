import { CalculatorService } from "./calculator.service";
import { LoggerService } from "./logger.service";
import { TestBed } from "@angular/core/testing";

describe("calculator service", () => {
    let loggerService:any;
    let calculator:CalculatorService;
  beforeEach(() => {
    loggerService = jasmine.createSpyObj("loggerService", ["log"]);
    TestBed.configureTestingModule({
        providers:[CalculatorService, {
            provide:LoggerService, useValue:loggerService
        }]
    })
    calculator = TestBed.get(CalculatorService);
  });

  it("should add two number", () => {
    const result = calculator.add(2, 6);
    expect(loggerService.log).toHaveBeenCalledTimes(1);
    expect(result).toBe(8);
  });
  it("should subtract two number", () => {
    const result = calculator.subtract(2, 6);
    expect(loggerService.log).toHaveBeenCalledTimes(1);
    expect(result).toBe(-4, "unexpected error message");
  });
});
